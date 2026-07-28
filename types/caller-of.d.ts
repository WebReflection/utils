export type CallerOf<F extends (...args: any[]) => any> = (thisArg: ThisParameterType<F>, ...args: Parameters<F>) => ReturnType<F>;
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
declare const _default: <F extends (...args: any[]) => any>(fn: F) => CallerOf<F>;
export default _default;
