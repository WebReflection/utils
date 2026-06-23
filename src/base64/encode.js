// @ts-check

/** @typedef {{ alphabet?: import('../base64.js').Alphabet, format?: '' | import('../base64.js').Format, omitPadding?: boolean }} Options */

/**
 * @param {BlobPart} value
 * @param {Options} options
 * @returns {Promise<string>}
 */
export default async (value, options) => {
  let blob = new Blob([value]);
  // @ts-ignore
  if (options?.format) blob = new Response(blob.stream().pipeThrough(new CompressionStream(options.format)));
  // @ts-ignore
  return new Uint8Array(await blob.arrayBuffer()).toBase64(options);
};
