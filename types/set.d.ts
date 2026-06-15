/**
 * @template V
 * @extends {Set<V>}
 */
export default class _default<V> extends Set<V> {
    constructor(values?: readonly V[] | null | undefined);
    constructor(iterable?: Iterable<V> | null | undefined);
    /**
     * @param {V} value
     * @returns {V}
     */
    put(value: V): V;
}
