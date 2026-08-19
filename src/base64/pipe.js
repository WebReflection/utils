// @ts-check

/**
 * Pipes a body through a decompression stream.
 * @param {ReadableStream} body
 * @param {{ format: import('../base64.js').Format }} options
 * @returns {ReadableStream}
 */
export default (body, { format }) => body.pipeThrough(new DecompressionStream(
  /** @type {CompressionFormat} */(format)
));
