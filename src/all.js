// @ts-check

import bound from './bound.js';

const { isArray } = Array;
const { entries, fromEntries } = Object;

const { all, resolve } = bound(Promise);

/**
 * @typedef {{
 *   <T extends object>(obj: T): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
 *   <T extends unknown[]>(values: T): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
 *   <T extends [unknown, unknown, ...unknown[]]>(...values: T): Promise<{ [K in keyof T]: Awaited<T[K]> }>;
 * }} All
 */

/**
 * @param {unknown} obj
 * @param {...unknown} rest
 * @returns {Promise<unknown>}
 */
const values = (obj, ...rest) => {
  // resolve all arguments passed along as array
  if (rest.length)
    return all([obj, ...rest]);

  // resolve all entries in the array
  if (isArray(obj))
    return all(obj);

  // resolve the object literal values re-mapping
  // them as key-value pairs
  for (const [k, v] of entries(/** @type {object} */ (obj)))
    /** @type {Promise<[string, unknown]>[]} */(rest).push(resolve(v).then(v => [k, v]));

  // return the object literal with the resolved values
  return all(/** @type {Promise<[string, unknown]>[]} */(rest)).then(fromEntries);
};

export default /** @type {All} */(values);
