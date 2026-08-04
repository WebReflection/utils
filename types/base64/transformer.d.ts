export type Options = {
    alphabet?: import('../base64.js').Alphabet;
    buffer?: boolean;
    lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
};
/** @typedef {{ alphabet?: import('../base64.js').Alphabet, buffer?: boolean, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial'}} Options */
/**
 * A `TransformStream` that decodes base64 text chunks into `Uint8Array` chunks.
 * Options are forwarded to `Uint8Array.fromBase64()`.
 */
export default class extends TransformStream {
    /** @param {Options} [options] */
    constructor(options?: Options);
}
