declare const _default: <T extends readonly ((...args: any[]) => any)[]>(...args: T) => { [K in keyof T]: BoundKey<T[K]>; };
export default _default;
export type BoundKey<F extends (...args: any[]) => any> = (key: ThisParameterType<F>) => import("./bound.js").BoundMethod<F>;
