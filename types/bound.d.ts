declare function _default<T extends object>(target: T): Bound<T>;
export default _default;
export type BoundMethod<F> = unknown extends ThisParameterType<F> ? F : F extends (this: any, ...args: infer A) => infer R ? (...args: A) => R : never;
export type Bound<T_1> = { [K in keyof T_1 as T_1[K] extends Function ? K : never]: BoundMethod<T_1[K]>; };
