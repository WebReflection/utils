// @ts-check

const { create, defineProperty } = Object;
const {
  apply,
  get,
} = Reflect;

const { hasInstance } = Symbol;

/**
 * @param {function} fn
 * @param {function} param1
 * @returns
 */
const proto = (fn, { prototype }) => defineProperty(fn, 'prototype', { value: prototype });

const set = () => false;

/**
 * @param {object | function} ref
 * @param {object | function} source
 * @returns
 */
const proxied = (ref, source) => {
  const target = create(null);
  // @ts-ignore
  const hi = source[hasInstance]?.bind(source);
  return new Proxy(ref, {
    set,
    defineProperty: set,
    deleteProperty: set,
    preventExtensions: set,
    setPrototypeOf: set,
    // @ts-expect-error if source is not a function
    construct: (_, args) => new source(...args),
    // @ts-expect-error if source is not a function
    apply: (_, thisArg, args) => apply(source, thisArg, args),
    get: (_, key, ...rest) => key === hasInstance ?
      hi : (target[key] ?? (target[key] = value(get(source, key, ...rest)))),
  });
};

/**
 * @param {object | function} ref
 * @returns
 */
const value = ref => {
  const type = typeof ref;
  // @ts-expect-error ref is a function
  return type === 'function' && /^[A-Z]/.test(ref.name) ?
    // @ts-expect-error ref is a function
    proxied(proto(function () {}, ref), ref) :
    (type === 'object' && ref ? proxied(ref, ref) : ref)
  ;
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
