//@ts-check

/**
 * @template F
 * @typedef {unknown extends ThisParameterType<F> ? F : F extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : never} BoundMethod
 */

/**
 * @template T
 * @typedef {{[K in keyof T as T[K] extends Function ? K : never]: BoundMethod<T[K]>}} Bound
 */

/**
 * @type {ProxyHandler<any>}
 */
const handler = {
  get: (target, prop) => target[prop].bind(target),
};

/**
 * @template {object} T
 * @param {T} target
 * @returns {Bound<T>}
 */
export default target => new Proxy(target, handler);
