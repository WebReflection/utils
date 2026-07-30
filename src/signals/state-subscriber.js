import { raw } from './state.js';

/**
 * @template {import('./state.js').State} T
 * @param {T} state
 * @param {keyof T & string} key a known property name
 * @param {import('./index.js').Subscriber} callback
 * @returns {import('./index.js').Subscriber | undefined}
 */
export const subscribe = (state, key, callback) => raw(state, key)?.put(callback);

/**
 * @template {import('./state.js').State} T
 * @param {T} state
 * @param {keyof T & string} key a known property name
 * @param {import('./index.js').Subscriber} callback
 * @returns {boolean}
 */
export const unsubscribe = (state, key, callback) => !!(raw(state, key)?.delete(callback));
