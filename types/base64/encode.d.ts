export type Options = {
    alphabet?: import('../base64.js').Alphabet;
    format?: '' | import('../base64.js').Format;
    omitPadding?: boolean;
};
export default _default;
/** @typedef {{ alphabet?: import('../base64.js').Alphabet, format?: '' | import('../base64.js').Format, omitPadding?: boolean }} Options */
/**
 * @param {BlobPart} value
 * @param {Options} [options]
 * @returns {Promise<string>}
 */
declare function _default(value: BlobPart, options?: Options): Promise<string>;
