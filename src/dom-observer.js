// @ts-check

/**
 * This helper provides a unique observer for the whole DOM,
 * including all shadow roots. This should be used to register
 * multiple subscribers that would like to track added or removed nodes
 * within shadow roots or the main document.
 */

import WeakMap from './weakmap.js';

/** @typedef {(mutations: MutationRecord[]) => void} Subscriber */

/** @type {WeakMap<Node, ShadowRoot>} */
export const shadows = new WeakMap;

/** @type {Set<Subscriber>} */
export const subscribers = new Set;

const options = {
  childList: true,
  subtree: true,
};

const mo = new MutationObserver(mutations => {
  for (const s of subscribers) s(mutations);
});

mo.observe(document, options);

const method = 'attachShadow';
const attachShadow = Element.prototype[method];
Object.defineProperty(Element.prototype, method, {
  value() {
    // @ts-ignore apply forwards the original arguments list
    const shadowRoot = shadows.put(this, attachShadow.apply(this, arguments));
    mo.observe(shadowRoot, options);
    return shadowRoot;
  },
});
