// @ts-check

import encode from './base64/encode.js';
import decode from './base64/decode.js';

/** @typedef {string | ArrayBufferLike | ArrayBufferView} IO */

const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;
const HEADER_LENGTH = SALT_LENGTH + NONCE_LENGTH;

const PBKDF2 = 'PBKDF2';

const { isSafeInteger } = Number;
const { crypto } = globalThis;
const { subtle } = crypto;
const encoder = new TextEncoder;
const decoder = new TextDecoder;

/**
 * @param {IO} value
 * @returns {ArrayBuffer}
 */
const bytes = value => (
  typeof value === 'string' ?
    encoder.encode(/** @type {string} */(value)).buffer : (
      value instanceof ArrayBuffer ?
        value :
        // @ts-ignore
        new Uint8Array(value.buffer, value.byteOffset, value.byteLength).slice().buffer
    )
);

/**
 * @param {ArrayBuffer} buffer
 * @param {number} lower
 * @param {string} what
 * @returns
 */
const valid = (buffer, lower, what) => {
  if (buffer.byteLength < lower) throw new TypeError('Invalid ' + what);
  return buffer;
};

/** @param {number} length */
const random = length => crypto.getRandomValues(new Uint8Array(length));

const defaults = {
  iterations: 32_000,
  SHA: 256,
};

/**
 * Creates a password-based AES-GCM encrypt/decrypt pair.
 *
 * Each envelope contains a public 16-byte random salt and public 12-byte
 * random nonce followed by authenticated ciphertext.
 *
 * @param {IO} password
 * @param {{
 *   iterations?: number,
 *   SHA?: number,
 *   pepper?: IO
 * }} [options]
 * @returns {{
 *   encrypt: (value: IO, options?: import('./base64/encode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>,
 *   decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>
 * }}
 */
export default (
  /** @type {IO} */ password,
  {
    iterations = defaults.iterations,
    SHA = defaults.SHA,
    pepper,
  } = defaults
) => {
  if (iterations < 1 || !isSafeInteger(iterations))
    throw new RangeError('PBKDF2 iterations must be a positive integer');

  if (SHA !== 256 && SHA !== 384 && SHA !== 512)
    throw new RangeError('SHA must be 256, 384, or 512');

  const key = pepper == null ?
    subtle
      .importKey(
        'raw',
        valid(bytes(password), 1, 'password'),
        PBKDF2,
        false,
        ['deriveKey']
      ) :
    subtle
      .importKey(
        'raw',
        valid(bytes(pepper), 1, 'pepper'),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
      )
      .then(pepperKey => subtle.sign(
        'HMAC',
        pepperKey,
        valid(bytes(password), 1, 'password')
      ))
      .then(pepperedPassword => subtle.importKey(
        'raw',
        pepperedPassword,
        PBKDF2,
        false,
        ['deriveKey']
      ))
  ;

  /**
   * @param {Uint8Array} messageSalt
   * @returns {Promise<CryptoKey>}
   */
  const derive = async messageSalt => subtle.deriveKey(
    {
      name: PBKDF2,
      salt: /** @type {BufferSource} */(messageSalt),
      hash: `SHA-${SHA}`,
      iterations,
    },
    await key,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );

  return {
    /**
     * @param {IO} value
     * @param {import('./base64/encode.js').Options & { buffer?: boolean }} [options]
     * @returns {Promise<string | ArrayBuffer>}
     */
    async encrypt(value, options) {
      const messageSalt = random(SALT_LENGTH);
      const nonce = random(NONCE_LENGTH);
      const header = new Uint8Array(HEADER_LENGTH);
      header.set(messageSalt);
      header.set(nonce, SALT_LENGTH);

      const ciphertext = new Uint8Array(await subtle.encrypt(
        {
          name: 'AES-GCM',
          iv: /** @type {BufferSource} */(nonce),
          additionalData: /** @type {BufferSource} */(header),
          tagLength: 128,
        },
        await derive(messageSalt),
        bytes(value),
      ));

      const envelope = new Uint8Array(HEADER_LENGTH + ciphertext.length);
      envelope.set(header);
      envelope.set(ciphertext, HEADER_LENGTH);

      return options?.buffer && !options.format && !options.alphabet ?
        envelope.buffer :
        encode(envelope, options)
      ;
    },

    /**
     * @param {string | ArrayBuffer} value
     * @param {import('./base64/decode.js').Options & { buffer?: boolean }} [options]
     * @returns {Promise<string | ArrayBuffer>}
     */
    async decrypt(value, options) {
      const raw = typeof value === 'string' ?
        /** @type {ArrayBuffer} */(await decode(value, { ...options, buffer: true })) :
        value;

      const envelope = new Uint8Array(valid(raw, HEADER_LENGTH + 16, 'AES-GCM envelope'));

      const header = envelope.subarray(0, HEADER_LENGTH);

      const plain = await subtle.decrypt(
        {
          name: 'AES-GCM',
          iv: /** @type {BufferSource} */(header.subarray(SALT_LENGTH, HEADER_LENGTH)),
          additionalData: /** @type {BufferSource} */(header),
          tagLength: 128,
        },
        await derive(header.subarray(0, SALT_LENGTH)),
        envelope.subarray(HEADER_LENGTH),
      );

      return options?.alphabet || options?.format || !options?.buffer ?
        decoder.decode(plain) :
        plain;
    },
  };
};
