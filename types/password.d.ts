export type IO = string | ArrayBufferLike | ArrayBufferView;
/**
 * Thrown when an envelope's 32-bit version differs from the pair's version.
 * The received value can be forwarded to lookup parameters, pepper, or rotation.
 */
export declare class VersionError extends Error {
    /** @type {number} */ expected: number;
    /** @type {number} */ received: number;
    /**
     * @param {number} expected
     * @param {number} received
     */
    constructor(expected: number, received: number);
}
export default _default;
/**
 * Creates a password-based AES-GCM encrypt/decrypt pair.
 *
 * Each envelope contains a public uint32 version, a public 16-byte random salt,
 * a public 12-byte random nonce, and authenticated ciphertext. The version is
 * generic envelope metadata: it can represent pepper, iterations, SHA, format,
 * rotation, or any consumer-owned configuration set.
 *
 * @param {IO} password
 * @param {{
 *   SHA?: 256 | 384 | 512,
 *   iterations?: number,
 *   version?: number,
 *   pepper?: IO
 * }} [options]
 * @returns {{
 *   encrypt: (value: IO, options?: import('./base64/encode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>,
 *   decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & { buffer?: boolean }) => Promise<string | ArrayBuffer>
 * }}
 */
declare function _default(
/** @type {IO} */ password: IO, { SHA, iterations, version, pepper, }?: {
    SHA?: 256 | 384 | 512;
    iterations?: number;
    version?: number;
    pepper?: IO;
}): {
    encrypt: (value: IO, options?: import('./base64/encode.js').Options & {
        buffer?: boolean;
    }) => Promise<string | ArrayBuffer>;
    decrypt: (value: string | ArrayBuffer, options?: import('./base64/decode.js').Options & {
        buffer?: boolean;
    }) => Promise<string | ArrayBuffer>;
};
