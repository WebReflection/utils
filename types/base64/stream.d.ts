export type Options = {
    alphabet?: import('../base64.js').Alphabet;
    format?: '' | import('../base64.js').Format;
    lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
    type?: string;
};
export default _default;
/**
 * Decodes a base64 string into a `Response`, optionally decompressing the body.
 * @param {string} value - base64-encoded payload
 * @param {Options} [options] - `alphabet` and `lastChunkHandling` for the decoding, `format` for `DecompressionStream`, `type` for `Content-Type`
 * @returns {Response}
 */
declare function _default(value: string, options?: Options): Response;
