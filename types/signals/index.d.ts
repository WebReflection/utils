import Set from '../set.js';
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
     * @param {boolean} eager when `true`, every write notifies; otherwise
     * skips notify when `Object.is` says the value did not change
     */
    constructor(value: T, eager: boolean);
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
 * @param {() => (function | undefined)} callback effect callback; returns a cleanup
 * @param {Signal<unknown>[]} signals signals to track
 * @returns {() => void} dispose function that unsubscribes and runs cleanup
 */
export declare const effect: (callback: () => (Function | undefined), signals: Signal<unknown>[]) => () => void;
/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>} a signal that notifies only when the value changes
 * per `Object.is` (see `new Signal(value, true)` / `eager` to notify on every write)
 */
export declare const signal: <T>(value: T) => Signal<T>;
/**
 * @template T
 * @param {() => T} value
 * @param {Signal<unknown>[]} signals
 * @returns {Computed<T>}
 */
export declare const computed: <T>(value: () => T, signals: Signal<unknown>[]) => Computed<T>;
