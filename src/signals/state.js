// @ts-check

import { Signal, Computed, batch, computed, signal } from './index.js';
import dispose from '../patch/dispose.js';

const { assign, entries, values, getOwnPropertyDescriptors, defineProperties } = Object;

/** @type {WeakMap<State, [Set<Signal<unknown>>, Record<string, Signal<unknown>>]>} */
const subscriptions = new WeakMap;

export class State {
  [dispose]() {
    // @ts-ignore
    const [created] = subscriptions.get(this);
    for (const signal of created) signal[dispose]();
  }
}

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
 * @returns {T} a state object with the same shape as `object`
 */
export const create = object => {
  /** @type {PropertyDescriptorMap} */
  const descriptors = {};
  /** @type {Record<string, Signal<unknown>>} */
  const signals = {};
  /** @type {Set<Signal<unknown>>} */
  const created = new Set;
  for (let [key, descriptor] of entries(getOwnPropertyDescriptors(object))) {
    if ('value' in descriptor) {
      let isSignal = descriptor.value instanceof Signal;
      let $ = isSignal ? descriptor.value : signal(descriptor.value);
      signals[key] = $;
      if (!isSignal) created.add($);
      descriptors[key] = {
        configurable: descriptor.configurable,
        enumerable: descriptor.enumerable,
        get: () => $.value,
        set: isSignal && $ instanceof Computed ?
          void 0 :
          value => $.value = value,
      };
    }
    else {
      if (!descriptor.set) {
        let get = /** @type {function | Computed<unknown>} */ (descriptor.get), init = true;
        descriptor = {
          ...descriptor,
          get() {
            if (init) {
              init = false;
              get = computed(/** @type {() => unknown} */ (get).bind(this), [...values(signals)]);
              signals[key] = get;
              created.add(get);
            }
            // @ts-ignore
            return get.value;
          }
        };
      }
      descriptors[key] = descriptor;
    }
  }
  const state = new State;
  subscriptions.set(state, [created, signals]);
  return /** @type {T} */ (defineProperties(state, descriptors));
};

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
export const raw = (state, key) => (
  // ensure lazy computed initialization
  state[key],
  // return the raw signal or computed
  // @ts-ignore
  subscriptions.get(state)[1][key]
);

/**
 * Assign `object` onto `state` inside a single {@link batch}, so dependents
 * run once after all listed keys are updated.
 *
 * @template {State} T
 * @param {T} state a state object from {@link create}
 * @param {Partial<T>} object a partial of known keys to write
 * @returns {T} the same `state` reference
 */
export const update = (state, object) => {
  batch(() => assign(state, object));
  return state;
};
