// @ts-check

/**
 * Wrap a `{ get, set }` descriptor as a single async function.
 *
 * **Descriptor contract** ({@link AsyncDescriptor}): any object or class
 * instance that defines or inherits both methods. Extra properties are allowed.
 * `get` takes no arguments and may return `T` or `Promise<T>`. `set` takes
 * exactly one `T` and may return `void` or `Promise<void>`. As with native
 * `Object.defineProperty` accessors, `get` must not declare parameters and
 * `set` must declare one — do not use `@type` on `set` to fake its arity.
 *
 * **Accessor contract** ({@link AsyncAccessorFn}): the returned `async`
 * function always yields a `Promise`. `await ref()` reads (`Promise<T>`),
 * `await ref(value)` writes (`Promise<void>`, always `undefined`). This
 * mirrors `await ref.value` for reads; writes are `await ref.value(x)` since
 * assignment syntax cannot be expressed via descriptors alone.
 *
 * @template T
 * @typedef {{
 *   get(): T | Promise<T>,
 *   set(value: T): void | Promise<void>
 * }} AsyncDescriptor
 */

/**
 * @template G
 * @typedef {G extends () => infer R ? (R extends Promise<infer U> ? U : R) : never} AsyncAccessorValue
 */

/**
 * @template T
 * @typedef {{
 *   (): Promise<T>,
 *   (value: T): Promise<void>
 * }} AsyncAccessorFn
 */

/**
 * @typedef {{
 *   <T, D extends AsyncDescriptor<T> & {
 *     get: (...args: any) => any,
 *     set: (...args: any) => any
 *   }>(
 *     descriptor: Parameters<D['get']> extends []
 *       ? Parameters<D['set']> extends [T]
 *         ? D
 *         : never
 *       : never
 *   ): AsyncAccessorFn<AsyncAccessorValue<D['get']>>
 * }} AsyncAccessor
 */

/** @type {AsyncAccessor} */
const asyncAccessor = descriptor => /** @type {AsyncAccessorFn<any>} */ (
  async function (value) {
    const ref = /** @type {AsyncDescriptor<any> & object} */ (descriptor);
    if (arguments.length < 1) return ref.get();
    await ref.set(value);
  }
);

export default asyncAccessor;
