// @ts-check

import Map from '../map.js';
import WeakMap from '../weak/map.js';
import { subscribers, shadows } from '../dom/observer.js';

import { array as _ } from '../empty.js';

const tracked = new WeakMap;

/**
 * @param {Node} node
 * @returns {NodeList}
 */
const sub = node => (shadows.get(node) ?? /** @type {Element} */(node)).querySelectorAll?.('*') || _;

/**
 * @param {NodeList} nodes
 * @param {Set<Node>} added
 * @param {Set<Node>} removed
 * @param {boolean} connected
 */
const loop = (nodes, added, removed, connected) => {
  for (let i = 0, node, observed; i < nodes.length; i++) {
    node = nodes[i];
    if (connected) {
      if (!added.has(node)) {
        added.add(node);
        removed.delete(node);
        observed = tracked.get(node);
        if (observed) for (const [f, s] of observed) s.put(f)();
        loop(sub(node), added, removed, connected);
      }
    }
    else if (!removed.has(node)) {
      removed.add(node);
      added.delete(node);
      observed = tracked.get(node);
      if (observed) for (const [f, s] of observed) s.delete(f);
      loop(sub(node), added, removed, connected);
    }
  }
};

subscribers.add(mutations => {
  const added = new Set, removed = new Set;
  for (const { addedNodes, removedNodes } of mutations) {
    loop(removedNodes, added, removed, false);
    loop(addedNodes, added, removed, true);
  }
});

/**
 * @param {Node} node
 */
const observe = node => (tracked.get(node) ?? tracked.put(node, new Map));

/**
 * @param {Node} node
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export const subscribe = (node, signal, callback) =>
  observe(node).put(callback, signal).put(callback);

/**
 * @param {Node} node
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export const unsubscribe = (node, signal, callback) => {
  signal.delete(callback);
  return observe(node).delete(callback);
};