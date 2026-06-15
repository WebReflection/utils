/**
 * @template K,V
 * @extends {Map<K,V>}
 */
export default class _default<K, V> extends Map<K, V> {
    constructor();
    constructor(entries?: readonly (readonly [K, V])[] | null | undefined);
    constructor();
    constructor(iterable?: Iterable<readonly [K, V]> | null | undefined);
    /**
     * @param {K} key
     * @param {V} value
     * @returns {V}
     */
    put(key: K, value: V): V;
}
