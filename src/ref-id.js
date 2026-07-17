// @ts-check

import id from './id.js';

const next = id();

/** @type {Set<number>} */
const ids = new Set;

/** @type {WeakMap<WeakKey, number>} */
const objects = new WeakMap;

/** @type {FinalizationRegistry<number>} */
const fr = new FinalizationRegistry(id => ids.delete(id));

/**
 * @param {WeakKey} ref
 * @param {number} id
 * @returns {number}
 */
const unique = (ref, id) => {
  while (ids.has(id)) id = next();
  objects.set(ref, id);
  fr.register(ref, id);
  ids.add(id);
  return id;
};

/**
 * Returns a unique Int32-range numeric identifier for any WeakMap-compatible key.
 * @param {WeakKey} ref
 * @returns {number}
 */
export default ref => objects.get(ref) ?? unique(ref, next());
