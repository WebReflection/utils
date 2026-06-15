/**
 * @template {WeakKey} V
 * @extends {WeakSet<V>}
 */
export default class _default<V extends WeakKey> extends WeakSet<V> {
    constructor(values?: readonly V[] | null | undefined);
    constructor(iterable: Iterable<V>);
    /**
     * @param {V} value
     * @returns {V}
     */
    put(value: V): V;
}
