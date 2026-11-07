export type Options = {
    alphabet?: import('../base64.js').Alphabet;
    buffer?: boolean;
    lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial';
};
/** @typedef {{ alphabet?: import('../base64.js').Alphabet, buffer?: boolean, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial'}} Options */
/**
 * A `TransformStream` that decodes base64 text chunks into `Uint8Array` chunks.
 * Chunks don't need to be aligned to base64 groups: the trailing partial group
 * is buffered until complete, and decoded at flush time.
 * Options are forwarded to `Uint8Array.fromBase64()`.
 */
export default class extends TransformStream {
    /** @param {Options} [options] */
    constructor(options?: Options);
}
