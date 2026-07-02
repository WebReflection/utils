export default asyncAccessor;
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
 * **Context** ({@link AsyncDescriptorContext}): `get` and `set` are invoked
 * with a `this` value. When the returned accessor is called as a property
 * (`await host.ref()`), that host is the context. When called standalone
 * (`await ref()`), the descriptor object passed to `asyncAccessor` is used
 * instead. Annotate `get` / `set` with `@this` (or a `this` parameter in
 * `.d.ts` consumers) to type the expected context.
 *
 * **Accessor contract** ({@link AsyncAccessorFn}): the returned `async`
 * function always yields a `Promise`. `await ref()` reads (`Promise<T>`),
 * `await ref(value)` writes (`Promise<void>`, always `undefined`). This
 * mirrors `await ref.value` for reads; writes are `await ref.value(x)` since
 * assignment syntax cannot be expressed via descriptors alone.
 */
export type AsyncDescriptor<T, C = any> = {
    get(this: C): T | Promise<T>;
    set(this: C, value: T): void | Promise<void>;
};
/**
 * Context bound as `this` when `get` or `set` run. Defaults to the descriptor
 * object when the accessor is not called as a property.
 */
export type AsyncDescriptorContext<C> = C;
export type AsyncAccessorValue<G> = G extends () => infer R ? (R extends Promise<infer U> ? U : R) : never;
export type AsyncAccessorFn<T> = {
    (): Promise<T>;
    (value: T): Promise<void>;
};
export type AsyncAccessor = {
    <T, C, D extends AsyncDescriptor<T, C> & {
        get: (this: C, ...args: []) => any;
        set: (this: C, ...args: [T]) => any;
    }>(descriptor: D): AsyncAccessorFn<AsyncAccessorValue<D["get"]>>;
};
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
 * **Context** ({@link AsyncDescriptorContext}): `get` and `set` are invoked
 * with a `this` value. When the returned accessor is called as a property
 * (`await host.ref()`), that host is the context. When called standalone
 * (`await ref()`), the descriptor object passed to `asyncAccessor` is used
 * instead. Annotate `get` / `set` with `@this` (or a `this` parameter in
 * `.d.ts` consumers) to type the expected context.
 *
 * **Accessor contract** ({@link AsyncAccessorFn}): the returned `async`
 * function always yields a `Promise`. `await ref()` reads (`Promise<T>`),
 * `await ref(value)` writes (`Promise<void>`, always `undefined`). This
 * mirrors `await ref.value` for reads; writes are `await ref.value(x)` since
 * assignment syntax cannot be expressed via descriptors alone.
 *
 * @template T
 * @template [C=any]
 * @typedef {{
 *   get(this: C): T | Promise<T>,
 *   set(this: C, value: T): void | Promise<void>
 * }} AsyncDescriptor
 */
/**
 * Context bound as `this` when `get` or `set` run. Defaults to the descriptor
 * object when the accessor is not called as a property.
 * @template C
 * @typedef {C} AsyncDescriptorContext
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
 *   <T, C, D extends AsyncDescriptor<T, C> & {
 *     get: (this: C, ...args: []) => any,
 *     set: (this: C, ...args: [T]) => any
 *   }>(
 *     descriptor: D
 *   ): AsyncAccessorFn<AsyncAccessorValue<D['get']>>
 * }} AsyncAccessor
 */
/** @type {AsyncAccessor} */
declare const asyncAccessor: AsyncAccessor;
