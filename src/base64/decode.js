// @ts-check

/** @typedef {{ alphabet?: import('../base64.js').Alphabet, buffer?: boolean, format?: '' | import('../base64.js').Format, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial'}} Options */

const decoder = new TextDecoder;

/**
 * @param {string} value
 * @param {Options} options
 * @returns {Promise<string | ArrayBuffer>}
 */
export default async (value, options) => {
  // @ts-ignore
  let blob = new Blob([Uint8Array.fromBase64(value)]), buffer;
  // @ts-ignore
  if (options?.format) blob = new Response(blob.stream().pipeThrough(new DecompressionStream(options.format)));
  buffer = await blob.arrayBuffer();
  return options?.buffer ? buffer : decoder.decode(buffer);
};
