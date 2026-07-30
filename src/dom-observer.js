// @ts-check

/**
 * Unique document-wide MutationObserver (including shadow roots) for multiple
 * subscribers tracking added or removed nodes. Setup runs once per realm via
 * sticky; later module copies reuse the same `subscribers` and `shadows`.
 * Requires a DOM (`document`, `MutationObserver`, `Element`).
 */

import WeakMap from './weakmap.js';
import sticky from './sticky.js';

/** @typedef {(mutations: MutationRecord[]) => void} Subscriber */

const [{ shadows, subscribers }, known] = sticky(
  '@webreflection/utils/dom-observer',
  {
    /** @type {WeakMap<Node, ShadowRoot>} */
    shadows: new WeakMap,
    /** @type {Set<Subscriber>} */
    subscribers: new Set,
  },
);

if (!known) {
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
}

export { shadows, subscribers };
