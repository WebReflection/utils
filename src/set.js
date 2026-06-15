// @ts-check

/**
 * @template V
 * @extends {Set<V>}
 */
export default class extends Set {
  /**
   * @param {V} value
   * @returns {V}
   */
  put(value) {
    this.add(value);
    return value;
  }
}
