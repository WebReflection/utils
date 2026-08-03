// @ts-check

import Set from '../set.js';
import dispose from '../patch/dispose.js';

const { is } = Object;

/**
 * @typedef {() => void} Subscriber
 */

/**
 * @param {Subscriber} callback
 */
const invoke = callback => {
  callback();
};

/**
 * @param {Signal<unknown>[]} signals
 * @param {'add' | 'delete'} method
 * @param {Subscriber} callback
 */
const loop = (signals, method, callback) => {
  for (let i = 0; i < signals.length; i++)
    signals[i][method](callback);
};

/** @type {Set<Subscriber> | null} */
let batching = null;

/** @type {Set<Subscriber> | null} */
let batched = null;

export { dispose };

/**
 * @template T
 * @extends {Set<Subscriber>}
 */
export class Signal extends Set {
  /** @type {boolean} */
  #eager;

  /** @type {T} */
  #value;

  /**
   * @param {T} value
   * @param {boolean} eager when `true`, every write notifies; otherwise
   * skips notify when `Object.is` says the value did not change
   */
  constructor(value, eager) {
    super();
    this.#eager = eager;
    this.#value = value;
  }

  /** @type {T} */
  get value() {
    return this.#value;
  }

  /**
   * @param {T} value
   */
  set value(value) {
    if (this.#eager || !is(this.#value, value)) {
      this.#value = value;
      if (batching === null) this.forEach(invoke);
      // @ts-ignore
      else batching = batching.union(this);
    }
  }

  [dispose]() {
    super.clear();
  }
}

/**
 * Parent `Signal` stores the recompute callback; this class exposes the computed `T`.
 *
 * @template T
 * @extends {Signal<*>}
 */
export class Computed extends Signal {
  /** @type {T} */
  // @ts-ignore assigned via callback() before constructor returns
  #value;

  /** @type {Signal<unknown>[]} */
  #signals;

  /**
   * @param {() => T} value
   * @param {Signal<unknown>[]} signals
   */
  constructor(value, signals) {
    /** @type {Subscriber} */
    const callback = () => {
      this.#value = value();
      // triggers listeners via Signal accessor
      super.value = callback;
    };
    super(callback, true);
    this.#signals = signals;
    loop(signals, 'add', callback);
    callback();
  }

  /** @type {T} */
  get value() {
    return this.#value;
  }

  [dispose]() {
    loop(this.#signals, 'delete', super.value);
  }
}

/**
 * @param {() => void} callback batch callback
 */
export const batch = callback => {
  if (batching === null) {
    batching = new Set;
    try {
      callback();
      [batched, batching] = [batching, null];
      batched.forEach(invoke);
    }
    finally {
      [batched, batching] = [null, null];
    }
  }
  else callback();
};

/**
 * @param {() => (function | undefined)} callback effect callback; returns a cleanup
 * @param {Signal<unknown>[]} signals signals to track
 * @returns {() => void} dispose function that unsubscribes and runs cleanup
 */
export const effect = (callback, signals) => {
  /** @type {function | undefined} */
  let cleanup, wrap = () => {
    cleanup?.();
    cleanup = callback();
  };
  loop(signals, 'add', wrap);
  wrap();
  return () => {
    loop(signals, 'delete', wrap);
    cleanup?.();
  };
};

/**
 * @template T
 * @param {T} value
 * @returns {Signal<T>} a signal that notifies only when the value changes
 * per `Object.is` (see `new Signal(value, true)` / `eager` to notify on every write)
 */
export const signal = value => new Signal(value, false);

/**
 * @template T
 * @param {() => T} value
 * @param {Signal<unknown>[]} signals
 * @returns {Computed<T>}
 */
export const computed = (value, signals) => new Computed(value, signals);
