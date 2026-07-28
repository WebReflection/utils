export type Options = {
    alphabet?: import('../base64.js').Alphabet;
    buffer?: boolean;
    format?: '' | import('../base64.js').Format;
    lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
};
export default _default;
/**
 * @param {string} value
 * @param {Options} options
 * @returns {Promise<string | ArrayBuffer>}
 */
declare function _default(value: string, options: Options): Promise<string | ArrayBuffer>;
