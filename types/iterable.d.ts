export type EnsureIterable = {
    <T extends Iterable<unknown>>(ref: T): T;
    <T extends object>(ref: T): T & Iterable<[string, T[keyof T]]>;
};
declare const _default: EnsureIterable;
export default _default;
