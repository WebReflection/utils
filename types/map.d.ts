/**
 * @template K,V
 * @extends {Map<K,V>}
 */
export default class<K, V> extends Map<K, V> {
    /**
     * @param {K} key
     * @param {V} value
     * @returns {V}
     */
    put(key: K, value: V): V;
}
