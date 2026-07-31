export type Descriptor<T, C = any> = {
    get(this: C): T;
    set(this: C, value: T): void;
};
export type DescriptorContext<C> = C;
export type AccessorValue<G> = G extends () => infer R ? R : never;
export type AccessorFn<T> = {
    (): T;
    (value: T): T;
};
export type Accessor = {
    <T, C, D extends Descriptor<T, C> & {
        get: (this: C, ...args: []) => any;
        set: (this: C, ...args: [T]) => any;
    }>(descriptor: D): AccessorFn<AccessorValue<D['get']>>;
};
/**
 * Wrap a `{ get, set }` descriptor as a single synchronous function.
 *
 * **Descriptor contract** ({@link Descriptor}): any object or class
 * instance that defines or inherits both methods. Extra properties are allowed.
 * `get` takes no arguments and may return `T`. `set` takes exactly one `T`
 * and may return `void`. As with native `Object.defineProperty` accessors,
 * `get` must not declare parameters and `set` must declare one — do not use
 * `@type` on `set` to fake its arity.
 *
 * **Context** ({@link DescriptorContext}): `get` and `set` are invoked with a
 * `this` value. When the returned accessor is called as a property
 * (`ref()`), that host is the context. When called standalone (`ref()`),
 * the descriptor object passed to `accessor` is used instead.
 * Annotate `get` / `set` with `@this` (or a `this` parameter in `.d.ts`
 * consumers) to type the expected context.
 *
 * **Accessor contract** ({@link AccessorFn}): the returned function returns
 * a `T` for both reads (`ref()`) and writes (`ref(value)`), mirroring
 * `(value = x)` where assignment yields the assigned value. Writes are
 * `ref(value)` since assignment syntax cannot be expressed via descriptors
 * alone.
 *
 * @template T
 * @template [C=any]
 * @typedef {{
 *   get(this: C): T,
 *   set(this: C, value: T): void
 * }} Descriptor
 */
/**
 * Context bound as `this` when `get` or `set` run. Defaults to the descriptor
 * object when the accessor is not called as a property.
 * @template C
 * @typedef {C} DescriptorContext
 */
/**
 * @template G
 * @typedef {G extends () => infer R ? R : never} AccessorValue
 */
/**
 * @template T
 * @typedef {{
 *   (): T,
 *   (value: T): T
 * }} AccessorFn
 */
/**
 * @typedef {{
 *   <T, C, D extends Descriptor<T, C> & {
 *     get: (this: C, ...args: []) => any,
 *     set: (this: C, ...args: [T]) => any
 *   }>(
 *     descriptor: D
 *   ): AccessorFn<AccessorValue<D['get']>>
 * }} Accessor
 */
/** @type {Accessor} */
declare const accessor: Accessor;
export default accessor;
