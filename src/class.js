// @ts-check

const { setPrototypeOf } = Object;

/**
 * Returns a constructor whose `.prototype` is **the same object** as `Class.prototype`, so
 * `class Sub extends factory(Base)` can reuse the base prototype chain without `Base` ever
 * being invoked as a constructor by this module.
 *
 * When `new Sub(target)` runs, `Object.setPrototypeOf(target, new.target.prototype)` is
 * applied and the **same** `target` object is returned, so it becomes `instanceof Sub` while
 * typically remaining `instanceof Base` for an appropriate `target` (for example an
 * element created for that base).
 *
 * @template {abstract new (...args: any[]) => object} C
 * @param {C} Class Base constructor whose `.prototype` is aliased onto the returned function.
 * @returns {new (target: InstanceType<C>) => InstanceType<C>}
 */
export default Class => {
  /**
   * @param {InstanceType<C>} target
   * @returns {InstanceType<C>}
   */
  function Custom(target) {
    return setPrototypeOf(target, new.target.prototype);
  }
  Custom.prototype = Class.prototype;
  // call signature vs `new` — factory is only meant for `class Sub extends …`
  return /** @type {new (target: InstanceType<C>) => InstanceType<C>} */ (
    /** @type {unknown} */ (Custom)
  );
};
