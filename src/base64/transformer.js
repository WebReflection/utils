import { decoder } from './decode.js';

/** @typedef {{ alphabet?: import('../base64.js').Alphabet, buffer?: boolean, lastChunkHandling?: 'loose' | 'strict' | 'stop-before-partial'}} Options */

/**
 * A `TransformStream` that decodes base64 text chunks into `Uint8Array` chunks.
 * Chunks don't need to be aligned to base64 groups: the trailing partial group
 * is buffered until complete, and decoded at flush time.
 * Options are forwarded to `Uint8Array.fromBase64()`.
 */
export default class extends TransformStream {
  /** @param {Options} [options] */
  constructor(options) {
    /** @type {string} */
    let pending = '';
    super({
      async transform(chunk, controller) {
        pending += decoder.decode(await chunk, { stream: true });
        const length = pending.length - (pending.length % 4);
        if (length) {
          controller.enqueue(
            // @ts-ignore
            Uint8Array.fromBase64(pending.slice(0, length), options)
          );
          pending = pending.slice(length);
        }
      },
      flush(controller) {
        pending += decoder.decode();
        if (pending) controller.enqueue(
          // @ts-ignore
          Uint8Array.fromBase64(pending, options)
        );
      },
    });
  }
}
