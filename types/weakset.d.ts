/**
 * @template {WeakKey} V
 * @extends {WeakSet<V>}
 */
export default class<V extends WeakKey> extends WeakSet<V> {
    /**
     * @param {V} value
     * @returns {V}
     */
    put(value: V): V;
}
