// @ts-check

import Map from '../map.js';

import unique from '../ref-id.js';

const tracked = new Map;

const fr = new FinalizationRegistry(id => {
  for (const [callback, signal] of tracked.get(id)) {
    signal.delete(callback);
  }
  tracked.delete(id);
});

/**
 * @param {WeakKey} ref
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export const subscribe = (ref, signal, callback) => {
  let id = unique(ref), callbacks = tracked.get(id);
  if (!callbacks) {
    fr.register(ref, id, ref);
    tracked.set(id, (callbacks = new Map));
  }
  callbacks.put(callback, signal).add(callback);
  return callback;
};

/**
 * @param {WeakKey} ref
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export const unsubscribe = (ref, signal, callback) => {
  let op = signal.delete(callback), id = unique(ref), callbacks = tracked.get(id);
  if (callbacks && (op = callbacks.delete(callback)) && callbacks.size === 0) {
    fr.unregister(ref);
    tracked.delete(id);
  }
  return op;
};
