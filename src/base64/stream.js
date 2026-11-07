// @ts-check

/** @typedef {{ alphabet?: import('../base64.js').Alphabet, format?: '' | import('../base64.js').Format, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial', type?: string }} Options */

import pipe from './pipe.js';

const type = 'application/octet-stream';

/**
 * Decodes a base64 string into a `Response`, optionally decompressing the body.
 * @param {string} value - base64-encoded payload
 * @param {Options} [options] - `alphabet` and `lastChunkHandling` for the decoding, `format` for `DecompressionStream`, `type` for `Content-Type`
 * @returns {Response}
 */
export default (value, options) => {
  // @ts-ignore
  const bytes = Uint8Array.fromBase64(value, options);
  return new Response(
    // @ts-ignore
    options?.format ? pipe(new Blob([bytes]).stream(), options) : bytes,
    { headers: { 'content-type': options?.type ?? type } }
  );
};
