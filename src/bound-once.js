//@ts-check

/**
 * @type {WeakMap<object, Map<string | symbol, (...args: any[]) => unknown>>}
 */
const methods = new WeakMap;

/**
 * @type {ProxyHandler<any>}
 */
const handler = {
  get(target, prop) {
    const known = /** @type {Map<string | symbol, (...args: any[]) => unknown>} */ (methods.get(target));
    let method = known.get(prop);
    if (!method) known.set(prop, (method = target[prop].bind(target)));
    return method;
  }
};

/**
 * @template {object} T
 * @param {T} target
 * @returns {import('./bound.js').Bound<T>}
 */
export default target => {
  let known = methods.get(target);
  if (!known) methods.set(target, (known = new Map));
  return new Proxy(target, handler);
};
