export { dispose };
/**
 * @template T
 */
export class Signal<T> {
    [x: symbol]: () => void;
    /**
     * @param {T} value
     */
    constructor(value: T);
    /**
     * @param {T} value
     */
    set value(value: T);
    /** @type {T} */
    get value(): T;
    /**
     * @param {Subscriber} subscriber
     * @returns {this}
     */
    add(subscriber: Subscriber): this;
    /**
     * @param {Subscriber} subscriber
     * @returns {boolean}
     */
    delete(subscriber: Subscriber): boolean;
    #private;
}
/**
 * Parent `Signal` stores the recompute callback; this class exposes the computed `T`.
 *
 * @template T
 * @extends {Signal<*>}
 */
export class Computed<T> extends Signal<any> {
    /**
     * @param {() => T} value
     * @param {Signal<unknown>[]} signals
     */
    constructor(value: () => T, signals: Signal<unknown>[]);
    /**
     * @type {T}
     * @readonly
     */
    readonly get value(): T;
    #private;
}
export function batch(callback: () => void): void;
export function effect(callback: () => void | (() => void), signals: Signal<unknown>[]): () => void;
export function signal<T>(value: T): Signal<T>;
export function computed<T>(value: () => T, signals: Signal<unknown>[]): Computed<T>;
export type Subscriber = () => void;
import dispose from '../dispose.js';
