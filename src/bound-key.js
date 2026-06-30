// @ts-check

import Map from './map.js';

/**
 * @template {(...args: any[]) => any} F
 * @typedef {(key: ThisParameterType<F>) => import('./bound.js').BoundMethod<F>} BoundKey
 */

/**
 * @this {Function}
 * @template K
 * @param {Map<K, Function>} map
 * @param {K} key
 * @returns {Function}
 */
function map(map, key) {
  return map.get(key) ?? map.put(key, this.bind(key));
}

const per = /** @type {<F extends (...args: any[]) => any>(fn: F) => BoundKey<F>} */ (
  fn => map.bind(fn, new Map)
);

export default /** @type {<T extends readonly ((...args: any[]) => any)[]>(...args: T) => { [K in keyof T]: BoundKey<T[K]> }} */ (
  (...args) => /** @type {any} */ (args.map(per))
);
