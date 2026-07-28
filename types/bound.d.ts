export type BoundMethod<F> = unknown extends ThisParameterType<F> ? F : F extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : never;
export type Bound<T> = {
    [K in keyof T as T[K] extends Function ? K : never]: BoundMethod<T[K]>;
};
export default _default;
/**
 * @template {object} T
 * @param {T} target
 * @returns {Bound<T>}
 */
declare function _default<T extends object>(target: T): Bound<T>;
