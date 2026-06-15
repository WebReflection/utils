/**
 * @template {WeakKey} K
 * @template V
 * @extends {WeakMap<K,V>}
 */
export default class _default<K extends WeakKey, V> extends WeakMap<K, V> {
    constructor(entries?: readonly (readonly [K, V])[] | null | undefined);
    constructor(iterable?: Iterable<readonly [K, V]> | null | undefined);
    /**
     * @param {K} key
     * @param {V} value
     * @returns {V}
     */
    put(key: K, value: V): V;
}
