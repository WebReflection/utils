export type IO = string | ArrayBufferLike | ArrayBufferView;
export default _default;
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
declare function _default(
/** @type {IO} */
password: IO, { iterations, method, name, iv, SHA, }?: {
    iterations?: number;
    method?: string;
    name?: string;
    iv?: Uint8Array;
    SHA?: number;
}): {
    encrypt: (value: IO, options?: import('./base64/encode.js').Options & {
        buffer?: boolean;
        iv?: Uint8Array;
    }) => Promise<string | ArrayBuffer>;
    decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & {
        iv?: Uint8Array;
    }) => Promise<string | ArrayBuffer>;
};
