/**
 * @template K,V
 * @extends Map<K,V>
 */
export default class Cache<K, V> extends Map<K, V> {
    /**
     * @param {number} [delay]
     */
    constructor(delay?: number);
    /**
     * @param {K} key
     * @param {V} value
     * @returns
     */
    getOrInsert(key: K, value: V): V | undefined;
    /**
     * @param {K} key
     * @param {(key: K) => V} callback
     * @returns
     */
    getOrInsertComputed(key: K, callback: (key: K) => V): V | undefined;
    /**
     * This method is slightly faster than `getOrInsert` or `getOrInsertComputed`
     * but it does not check if the key already exists, possibly pushing it twice.
     * However, doing `ref.get(key) ?? ref.put(key, value)` provides same functionality as
     * `ref.getOrInsert(key, value)` or `ref.getOrInsertComputed(key, callback)`.
     * @param {K} key
     * @param {V} value
     * @returns
     */
    put(key: K, value: V): V;
    /**
     * @param {K} key
     * @param {V} value
     * @returns
     */
    set(key: K, value: V): this;
    #private;
}
