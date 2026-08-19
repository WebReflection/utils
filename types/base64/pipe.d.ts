export default _default;
/**
 * Pipes a body through a decompression stream.
 * @param {ReadableStream} body
 * @param {{ format: import('../base64.js').Format }} options
 * @returns {ReadableStream}
 */
declare function _default(body: ReadableStream, { format }: {
    format: import('../base64.js').Format;
}): ReadableStream;
