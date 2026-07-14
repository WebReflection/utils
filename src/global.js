// @ts-check

const { create } = Object;
const {
  apply,
  construct,
  get,
} = Reflect;

const set = () => false;

/**
 * 
 * @param {object | function} ref
 * @param {object} target
 * @param {object | function} source
 * @returns
 */
const proxied = (ref, target, source) => new Proxy(ref, {
  set,
  defineProperty: set,
  deleteProperty: set,
  preventExtensions: set,
  setPrototypeOf: set,
  // @ts-expect-error source is a function
  construct: (_, args) => construct(source, args),
  // @ts-expect-error source is a function
  apply: (_, thisArg, args) => apply(source, thisArg, args),
  // @ts-expect-error target is a generic object
  get: (_, key, ...rest) => (target[key] ?? (target[key] = value(get(source, key, ...rest)))),
});

/**
 * @param {object | function} ref
 * @returns
 */
const value = ref => {
  switch (typeof ref) {
    case 'function':
      return proxied(function () {}, create(null), ref);
    case 'object':
      if (!ref) break;
      return proxied(ref, create(null), ref);
  }
  return ref;
};

/**
 * Lazily trapped view of {@link globalThis}. Import this module as early as
 * possible in the page or bundle so native constructors, prototypes, and other
 * globals are snapshotted before third-party scripts can replace or pollute them.
 *
 * The first script that reads a property through this export receives a
 * one-time, reliable copy of that value. Non-null objects are trapped
 * recursively, so deeper references such as `Object.prototype.toString` stay
 * faithful to the moment they were first accessed, even if the live
 * `globalThis` or its prototypes are later reassigned or augmented.
 */
const global = /** @type {typeof globalThis} */ (value(globalThis));

export default global;
