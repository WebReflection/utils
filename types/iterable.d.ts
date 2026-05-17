declare const _default: EnsureIterable;
export default _default;
/**
 * Ensures an object is iterable.
 *
 * If `ref` already defines or inherits `Symbol.iterator`, it is returned
 * unchanged. Otherwise, the same object is augmented with `Symbol.iterator`
 * yielding the entries produced by `Object.entries(ref)`.
 */
export type EnsureIterable = {
    <T extends Iterable<unknown>>(ref: T): T;
    <T extends object>(ref: T): T & Iterable<[string, T[keyof T]]>;
};
