/**
 * @template {WeakKey} K
 * @template V
 * @extends {WeakMap<K,V>}
 */
export default class<K extends WeakKey, V> extends WeakMap<K, V> {
    /**
     * @param {K} key
     * @param {V} value
     * @returns {V}
     */
    put(key: K, value: V): V;
}
