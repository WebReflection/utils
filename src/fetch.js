// @ts-check
/// <reference lib="dom" />

const { fetch } = globalThis;

/** @type {Set<PropertyKey>} */
const promiseMethods = new Set(['then', 'catch', 'finally']);

/**
 * Response body / clone methods that this proxy auto-invokes on access.
 * @typedef {'arrayBuffer' | 'blob' | 'bytes' | 'clone' | 'formData' | 'json' | 'text'} ResponseMethod
 */

/**
 * A `fetch` promise that also exposes Response fields as thenables.
 *
 * - `then` / `catch` / `finally` forward to the underlying `Promise<Response>`
 * - body / clone methods (`text`, `json`, ...) are invoked on access and resolve
 *   to their return value; if `response.ok` is false they reject with the Response
 * - other Response properties (`status`, `ok`, `headers`, ...) resolve to the
 *   property value
 *
 * @typedef {Promise<Response> & {
 *   [K in keyof Response]: K extends ResponseMethod
 *     ? Promise<Awaited<ReturnType<Response[K]>>>
 *     : Promise<Response[K]>;
 * }} FetchProxy
 */

/**
 * @type {ProxyHandler<any>}
 */
const handler = {
  get: (target, prop) =>
    promiseMethods.has(prop) ?
      target[prop].bind(target) :
      target.then(
        /** @param {Response} r */
        r => typeof r[/** @type {keyof Response} */ (prop)] === 'function' ?
          (r.ok ? r[/** @type {ResponseMethod} */ (prop)]() : Promise.reject(r)) :
          r[/** @type {keyof Response} */ (prop)]
      )
};

/**
 * Proxied `fetch` whose result exposes Response fields directly as thenables.
 *
 * @type {(...args: Parameters<typeof globalThis.fetch>) => FetchProxy}
 */
export default (url, ...rest) =>
  /** @type {FetchProxy} */ (new Proxy(fetch(url, ...rest), handler));
