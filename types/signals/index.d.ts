import dispose from '../patch/dispose.js';
export type Subscriber = () => void;
export { dispose };
/**
 * @template T
 * @extends {Set<Subscriber>}
 */
export declare class Signal<T> extends Set<Subscriber> {
    #private;
    [dispose]: () => void;
    /**
     * @param {T} value
     */
    constructor(value: T);
    /** @type {T} */
    get value(): T;
    /**
     * @param {T} value
     */
    set value(value: T);
}
/**
 * Parent `Signal` stores the recompute callback; this class exposes the computed `T`.
 *
 * @template T
 * @extends {Signal<*>}
 */
export declare class Computed<T> extends Signal<any> {
    #private;
    [dispose]: () => void;
    /**
     * @param {() => T} value
     * @param {Signal<unknown>[]} signals
     */
    constructor(value: () => T, signals: Signal<unknown>[]);
    /** @type {T} */
    get value(): T;
}
/**
 * @param {() => void} callback batch callback
 */
export declare const batch: (callback: () => void) => void;
/**
 * @param {() => void | (() => void)} callback effect callback; returns a cleanup
 * @param {Signal<unknown>[]} signals signals to track
 * @returns {() => void} dispose function that unsubscribes and runs cleanup
 */
export declare const effect: (callback: () => void | (() => void), signals: Signal<unknown>[]) => () => void;
/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>}
 */
export declare const signal: <T>(value: T) => Signal<T>;
/**
 * @template T
 * @param {() => T} value
 * @param {Signal<unknown>[]} signals
 * @returns {Computed<T>}
 */
export declare const computed: <T>(value: () => T, signals: Signal<unknown>[]) => Computed<T>;
