// @ts-check

import encode from './base64/encode.js';
import decode from './base64/decode.js';
import { object } from './empty.js';

/** @typedef {string | ArrayBufferLike | ArrayBufferView} IO */

const SALT_LENGTH = 16;
const NONCE_LENGTH = 12;
const HEADER_LENGTH = SALT_LENGTH + NONCE_LENGTH + 4;

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
 * @param {number} i
 * @param {string} kind
 * @param {number} lower
 */
const check = (i, kind, lower) => {
  if (
    !isSafeInteger(i) ||
    i < lower ||
    i > 0xffffffff
  )
    throw new RangeError(`Invalid ${kind}`);
};

/**
 * @param {Uint8Array} additionalData
 * @param {Uint8Array} iv
 * @returns
 */
const chiperDetails = (additionalData, iv) => ({
  name: 'AES-GCM',
  tagLength: 128,
  additionalData,
  iv,
});

/**
 * @param {ArrayBuffer} buffer
 * @param {number} lower
 * @param {string} what
 * @returns
 */
const valid = (buffer, lower, what) => {
  if (buffer.byteLength < lower)
    throw new TypeError('Invalid ' + what);

  return buffer;
};

/** @param {number} length */
const random = length => crypto.getRandomValues(new Uint8Array(length));

/**
 * Thrown when an envelope's 32-bit version differs from the pair's version.
 * The received value can be forwarded to lookup parameters, pepper, or rotation.
 */
export class VersionError extends Error {
  /** @type {number} */ expected;
  /** @type {number} */ received;

  /**
   * @param {number} expected
   * @param {number} received
   */
  constructor(expected, received) {
    super('Invalid version: ' + received);
    this.expected = expected;
    this.received = received;
  }
}

/**
 * Creates a password-based AES-GCM encrypt/decrypt pair.
 *
 * Each envelope contains a public uint32 version, a public 16-byte random salt,
 * a public 12-byte random nonce, and authenticated ciphertext. The version is
 * generic envelope metadata: it can represent pepper, iterations, SHA, format,
 * rotation, or any consumer-owned configuration set.
 *
 * @param {IO} password
 * @param {{
 *   SHA?: 256 | 384 | 512,
 *   iterations?: number,
 *   version?: number,
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
    SHA = 256,
    iterations = 32_000,
    version = 0,
    pepper,
  } = object
) => {
  if (SHA !== 256 && SHA !== 384 && SHA !== 512)
    throw new RangeError('SHA must be 256, 384, or 512');

  check(iterations, 'iterations', 1);
  check(version, 'version', 0);

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
   * @param {Uint8Array} salt
   * @returns {Promise<CryptoKey>}
   */
  const derive = async salt => subtle.deriveKey(
    {
      name: PBKDF2,
      hash: `SHA-${SHA}`,
      iterations,
      // @ts-ignore
      salt,
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
      const salt = random(SALT_LENGTH);
      const nonce = random(NONCE_LENGTH);
      const header = new Uint8Array(HEADER_LENGTH);

      new DataView(header.buffer).setUint32(0, version, true);
      header.set(salt, 4);
      header.set(nonce, SALT_LENGTH + 4);

      const ciphertext = new Uint8Array(await subtle.encrypt(
        chiperDetails(header, nonce),
        await derive(salt),
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

      const v = new DataView(envelope.buffer).getUint32(0, true);
      if (v !== version)
        throw new VersionError(version, v);

      const header = envelope.subarray(0, HEADER_LENGTH);

      const plain = await subtle.decrypt(
        chiperDetails(header, header.subarray(SALT_LENGTH + 4, HEADER_LENGTH)),
        await derive(header.subarray(4, SALT_LENGTH + 4)),
        envelope.subarray(HEADER_LENGTH),
      );

      return options?.alphabet || options?.format || !options?.buffer ?
        decoder.decode(plain) :
        plain;
    },
  };
};
