// https://github.com/WebReflection/caller-of
// @ts-check

/**
 * @template {(...args: any[]) => any} F
 * @typedef {(thisArg: ThisParameterType<F>, ...args: Parameters<F>) => ReturnType<F>} CallerOf
 */

/**
 * Borrow a method so it can be invoked with an explicit `this` value
 * (e.g. `callerOf({}.hasOwnProperty)(obj, key)`).
 *
 * @template {(...args: any[]) => any} F
 * @param {F} fn
 * @returns {CallerOf<F>}
 */
export default /** @type {<F extends (...args: any[]) => any>(fn: F) => CallerOf<F>} */ (
  fn => fn.call.bind(fn)
);
