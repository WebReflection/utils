// @ts-check

/** @type {typeof Symbol.iterator} */
const iterator = Symbol.iterator;

const { defineProperty: dp, entries } = Object;

/**
 * @this {object}
 * @returns {Generator<[string, any], void, unknown>}
 */
function* value() {
  yield* entries(this);
}

const configurable = true;

/**
 * Ensures an object is iterable.
 *
 * If `ref` already defines or inherits `Symbol.iterator`, it is returned
 * unchanged. Otherwise, the same object is augmented with `Symbol.iterator`
 * yielding the entries produced by `Object.entries(ref)`.
 *
 * @typedef {{
 *   <T extends Iterable<unknown>>(ref: T): T;
 *   <T extends object>(ref: T): T & Iterable<[string, T[keyof T]]>;
 * }} EnsureIterable
 */

/**
 * @param {object} ref
 * @returns {object}
 */
const iterable = ref => iterator in ref ? ref : dp(ref, iterator, { configurable, value });

export default /** @type {EnsureIterable} */(iterable);
