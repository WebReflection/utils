// @ts-check

/**
 * @template K,V
 * @extends {Map<K,V>}
 */
export default class extends Map {
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
