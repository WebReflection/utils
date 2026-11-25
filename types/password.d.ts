export type IO = string | ArrayBufferLike | ArrayBufferView;
export default _default;
/**
 * Creates a password-based AES-GCM encrypt/decrypt pair.
 *
 * Each envelope contains a public 16-byte random salt and public 12-byte
 * random nonce followed by authenticated ciphertext.
 *
 * @param {IO} password
 * @param {{
 *   iterations?: number,
 *   SHA?: number,
 *   pepper?: IO
 * }} [options]
 * @returns {{
 *   encrypt: (value: IO, options?: import('./base64/encode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>,
 *   decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>
 * }}
 */
declare function _default(
/** @type {IO} */ password: IO, { iterations, SHA, pepper, }?: {
    iterations?: number;
    SHA?: number;
    pepper?: IO;
}): {
    encrypt: (value: IO, options?: import('./base64/encode.js').Options & {
        buffer?: boolean;
    }) => Promise<string | ArrayBuffer>;
    decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & {
        buffer?: boolean;
    }) => Promise<string | ArrayBuffer>;
};
