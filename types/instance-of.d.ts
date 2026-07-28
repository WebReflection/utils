export type InstanceOf = {
    <T extends object>(ref: T, list: Function[]): Function;
};
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
declare const _default: InstanceOf;
export default _default;
