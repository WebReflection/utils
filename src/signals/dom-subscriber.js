// @ts-check

import WeakMap from '../weakmap.js';
import Map from '../map.js';

import { array } from '../empty.js';

const tracked = new WeakMap;

/**
 * @param {Node} node
 */
const track = node => {
  for (const [fn, signal] of (tracked.get(node) ?? array)) {
      signal.add(fn);
      fn();
  }
  node.childNodes?.forEach(track);
};

/**
 * @param {Node} node
 */
const untrack = node => {
  for (const [fn, signal] of (tracked.get(node) ?? array)) {
    signal.delete(fn);
  }
  node.childNodes?.forEach(untrack);
};

const options = {
  childList: true,
  subtree: true,
};

const mo = new MutationObserver(
  mutations => {
    for (const { removedNodes, addedNodes } of mutations) {
      removedNodes.forEach(untrack);
      addedNodes.forEach(track);
    }
  }
);

mo.observe(document.documentElement, options);

const method = 'attachShadow';
const attachShadow = Element.prototype[method];
Object.defineProperty(Element.prototype, method, {
  value() {
    // @ts-ignore apply forwards the original arguments list
    const shadowRoot = attachShadow.apply(this, arguments);
    mo.observe(shadowRoot, options);
    return shadowRoot;
  },
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
export const subscribe = (node, signal, callback) => {
  observe(node).put(callback, signal).add(callback);
  return callback;
};

/**
 * @param {Node} node
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export const unsubscribe = (node, signal, callback) => {
  signal.delete(callback);
  return observe(node).delete(callback);
};
