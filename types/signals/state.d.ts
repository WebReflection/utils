import { Signal, Computed } from './index.js';
import dispose from '../patch/dispose.js';
export declare class State {
    [dispose]: () => void;
}
export type Created<T extends Record<string, unknown>> = State & {
    [K in keyof T]: T[K] extends Signal<infer V> ? V : T[K];
};
/**
 * Result of {@link create}: a {@link State} plus the input's own keys, with any
 * {@link Signal} / {@link Computed} values unwrapped to their `.value` type.
 *
 * @template {Record<string, unknown>} T
 * @typedef {State & { [K in keyof T]: T[K] extends Signal<infer V> ? V : T[K] }} Created
 */
/**
 * Create a reactive state object with the same keys and value types as `object`.
 * Each data property is backed by a signal: reads return the current value,
 * writes update that signal.
 *
 * If a value is already a {@link Signal} or {@link Computed}, it is used
 * directly. Otherwise a new {@link Signal} is created. Properties backed by a
 * {@link Computed} have no setter.
 *
 * Own getter-only accessors become lazy {@link Computed} values that depend on
 * every signal already present when first read (typically all data properties).
 * Accessors that define both `get` and `set` are left unchanged.
 *
 * @template {Record<string, unknown>} T
 * @param {T} object initial values; each own enumerable key becomes a property
 * @returns {Created<T>} a state object with the same shape as `object`
 */
export declare const create: <T extends Record<string, unknown>>(object: T) => Created<T>;
/**
 * Return the raw {@link Signal} or {@link Computed} for a key on a state object
 * from {@link create}. Touching the key first ensures lazy getter-only
 * computeds are initialized.
 *
 * Useful when subscribing or unsubscribing to a single field through
 * `ref-signals` or `dom-signals`.
 *
 * @template {State} T
 * @param {T} state a state object from {@link create}
 * @param {keyof T & string} key a known property name
 * @returns {Signal<unknown> | Computed<unknown> | undefined}
 */
export declare const raw: <T extends State>(state: T, key: keyof T & string) => Signal<unknown> | Computed<unknown> | undefined;
/**
 * Assign `object` onto `state` inside a single {@link batch}, so dependents
 * run once after all listed keys are updated.
 *
 * @template {State} T
 * @param {T} state a state object from {@link create}
 * @param {Partial<T>} object a partial of known keys to write
 * @returns {T} the same `state` reference
 */
export declare const update: <T extends State>(state: T, object: Partial<T>) => T;
