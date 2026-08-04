// @ts-check

/** @typedef {{ alphabet?: import('../base64.js').Alphabet, format?: '' | import('../base64.js').Format, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial', type?: string } & RequestInit} Options */

const type = 'application/octet-stream';

/**
 * Decodes a base64 string into a `Response`, optionally decompressing the body.
 * @param {string} value - base64-encoded payload
 * @param {Options} [options] - `format` for `DecompressionStream`, `type` for `Content-Type`
 * @returns {Promise<Response>}
 */
export default async (value, options) => {
  const { body } = await fetch(`data:${type};base64,${value}`);
  return new Response(
    // @ts-ignore
    options?.format ? body.pipeThrough(new DecompressionStream(options.format)) : body,
    { headers: { 'content-type': options?.type ?? type } }
  );
};
