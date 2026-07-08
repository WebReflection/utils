// @ts-check

const { isArray } = Array;

/**
 * @typedef {{
 *   <T extends object>(ref: T, list: Function[]): Function;
 * }} InstanceOf
 */

/**
 * @param {object} ref a non-null object (`typeof ref === 'object' && ref !== null`)
 * @param {Function[]} list
 * @returns {Function}
 */
export default /** @type {InstanceOf} */ ((ref, list) => {
  for (let i = 0, l = list.length; i < l; i++) {
    if (ref instanceof list[i]) return list[i];
  }
  return isArray(ref) ? Array : Object;
});
