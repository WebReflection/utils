// @ts-check

const { fromEntries } = Object;

/**
 * Each string key `K` maps to an array of plucked `T[K]` values.
 * Symbol keys are forwarded to the underlying array.
 *
 * @template {object} T
 * @typedef {{
 *   [K in keyof T as K extends symbol ? never : K]: T[K][];
 * } & Iterable<T>} MapFields
 */

/**
 * Each string key `K` maps to an array of objects that pick only that field.
 * Symbol keys are forwarded to the underlying array.
 *
 * @template {object} T
 * @typedef {{
 *   [K in keyof T as K extends string ? K : never]: Pick<T, K>[];
 * } & Iterable<T>} MapObjectFields
 */

const value = () => true;

/**
 * @param {any[]} array
 * @returns
 */
export const isSparse = array => !!array.length && !array.some(value)

/**
 * @this {PropertyKey}
 * @param {Record<PropertyKey, unknown>} item
 */
function field(item) {
  return item[this];
}

/**
 * @this {Record<PropertyKey, unknown>}
 * @param {string} key
 * @returns {[string, unknown]}
 */
function pair(key) {
  return [key, this[key]];
}

/**
 * @this {string[]}
 * @param {Record<PropertyKey, unknown>} item
 */
function reducer(item) {
  return fromEntries(this.map(pair, item));
}

/**
 * @param {any} target
 * @param {symbol} prop
 */
function forward(target, prop) {
  const value = target[prop];
  return typeof value === 'function' ? value.bind(target) : value;
}

/** @type {ProxyHandler<any>} */
const mapObjectHandler = {
  get: (target, prop) => typeof prop === 'symbol' ? forward(target, prop) : target.map(reducer, prop.split(','))
};

/** @type {ProxyHandler<any>} */
const mapHandler = {
  get: (target, prop) => typeof prop === 'symbol' ? forward(target, prop) : target.map(field, prop)
};

/**
 * Pluck one field from each object in `iterable`.
 *
 * `map(rows).x` is `rows.map(row => row.x)` without allocating a callback:
 * the proxy is one-off and collectable, and a shared getter runs with the
 * property name as `this`. Symbol keys (`Symbol.iterator`, `Symbol.dispose`,
 * …) are forwarded to `iterable`, with methods bound to that array.
 *
 * @template {object} T
 * @param {T[]} iterable
 * @returns {MapFields<T>}
 */
export const map = iterable => /** @type {MapFields<T>} */ (new Proxy(iterable, mapHandler));

/**
 * Pick one or more fields from each object in `iterable`.
 *
 * `mapObject(rows).x` is `rows.map(({ x }) => ({ x }))`. Multiple fields use
 * a comma-separated key — or an array of keys, which stringifies the same way:
 * `mapObject(rows)[['x', 'y', 'z']]`. Symbol keys are forwarded to `iterable`,
 * with methods bound to that array.
 *
 * @template {object} T
 * @param {T[]} iterable
 * @returns {MapObjectFields<T>}
 */
export const mapObject = iterable => /** @type {MapObjectFields<T>} */ (new Proxy(iterable, mapObjectHandler));
