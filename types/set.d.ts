/**
 * @template V
 * @extends {Set<V>}
 */
export default class<V> extends Set<V> {
    /**
     * @param {V} value
     * @returns {V}
     */
    put(value: V): V;
}
