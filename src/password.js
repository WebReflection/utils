// @ts-check

import encode from './base64/encode.js';
import decode from './base64/decode.js';

/** @typedef {string | ArrayBufferLike | ArrayBufferView} IO */

const { crypto: { subtle } } = globalThis;

/**
 * @param {boolean} asString
 * @param {IO} value
 * @returns {BufferSource}
 */
const asBufferSource = (asString, value) => /** @type {BufferSource} */(
  asString ? encoder.encode(/** @type {string} */(value)) : value
);

/**
 * @param {{ alphabet?: string, format?: string, buffer?: boolean }} [options]
 * @returns {boolean}
 */
const asString = options => !!(options?.alphabet || options?.format || !options?.buffer);

const encoder = new TextEncoder;
const decoder = new TextDecoder;

const defaults = {
  iterations: 8192,
  method: 'AES-CBC',
  name: 'PBKDF2',
  iv: new Uint8Array(16),
  SHA: 256,
};

/**
 * @param {IO} password
 * @param {{
 *   iterations?: number,
 *   method?: string,
 *   name?: string,
 *   iv?: Uint8Array,
 *   SHA?: number
 * }} [options]
 * @returns {{
 *   encrypt: (value: IO, options?: import('./base64/encode.js').Options & { buffer?: boolean, iv?: Uint8Array }) => Promise<string | ArrayBuffer>,
 *   decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & { iv?: Uint8Array }) => Promise<string | ArrayBuffer>
 * }}
 */
export default (
  /** @type {IO} */
  password,
  {
    iterations = defaults.iterations,
    method = defaults.method,
    name = defaults.name,
    iv = defaults.iv,
    SHA = defaults.SHA,
  } = defaults
) => {
  const salt = asBufferSource(typeof password === 'string', password);
  const key = subtle
    .importKey('raw', salt, { name }, false, ['deriveBits', 'deriveKey'])
    .then(key => subtle.deriveKey(
      {
        name,
        salt,
        iterations,
        hash: `SHA-${SHA}`
      },
      key,
      { name: method, length: SHA },
      true,
      ['encrypt', 'decrypt']
    ))
  ;

  return {
    /**
     * @param {IO} value
     * @param {import('./base64/encode.js').Options & { buffer?: boolean, iv?: Uint8Array }} [options]
     * @returns {Promise<string | ArrayBuffer>}
     */
    async encrypt(value, options) {
      const encrypted = await subtle.encrypt(
        { name: method, iv: /** @type {BufferSource} */(options?.iv ?? iv) },
        await key,
        asBufferSource(typeof value === 'string', value),
      );
      return asString(options) ? encode(encrypted, options) : encrypted;
    },

    /**
     * @param {string | ArrayBuffer} value
     * @param {import('./base64/decode.js').Options & { iv?: Uint8Array }} [options]
     * @returns {Promise<string | ArrayBuffer>}
     */
    async decrypt(value, options) {
      const decrypted = await subtle.decrypt(
        { name: method, iv: /** @type {BufferSource} */(options?.iv ?? iv) },
        await key,
        /** @type {BufferSource} */(
          typeof value === 'string' ?
            await decode(value, { ...options, buffer: true }) :
            value
        ),
      );
      return asString(options) ? decoder.decode(decrypted) : decrypted;
    },
  };
};
