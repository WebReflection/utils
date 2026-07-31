// @ts-check

/**
 * @template {WeakKey} K
 * @template V
 * @extends {WeakMap<K,V>}
 */
export default class extends WeakMap {
  /**
   * @param {K} key
   * @param {V} value
   * @returns {V}
   */
  put(key, value) {
    this.set(key, value);
    return value;
  }
}
