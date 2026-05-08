//@ts-check

import sticky from './sticky.js';

const methods = /** @type {WeakMap<object, Map<string | symbol, (...args: any[]) => unknown>>} */ (new WeakMap);

/** @type {ProxyHandler<any>} */
const handler = {
  get(target, prop) {
    const known = /** @type {Map<string | symbol, (...args: any[]) => unknown>} */ (methods.get(target));
    let method = known.get(prop);
    if (!method) known.set(prop, (method = target[prop].bind(target)));
    return method;
  }
};

export default sticky(
  '@webreflection/utils/bound-once',
  /**
   * @template {object} T
   * @param {T} target
   * @returns {import('./bound.js').Bound<T>}
   */
  target => {
    if (!methods.has(target)) methods.set(target, new Map);
    return new Proxy(target, handler);
  },
)[0];
