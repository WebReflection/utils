// @ts-check

/**
 * @template {WeakKey} V
 * @extends {WeakSet<V>}
 */
export default class extends WeakSet {
  /**
   * @param {V} value
   * @returns {V}
   */
  put(value) {
    this.add(value);
    return value;
  }
}
