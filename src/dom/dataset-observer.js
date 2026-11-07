// @ts-check

/** @typedef {null|undefined} nullish */

const re = /-(\S)/g;

/**
 * @param {string} _ 
 * @param {string} char 
 * @returns
 */
const place = (_, char) => char.toUpperCase();

const defaults = {
  attributes: true,
  attributeOldValue: true,
};

export default class extends MutationObserver {
  /**
   * @param {(target:HTMLElement, name:string, oldValue:string|nullish, newValue:string|nullish) => void} interceptor 
   */
  constructor(interceptor) {
    super(mutations => {
      for (const { target, attributeName, oldValue } of mutations) {
        if (/** @type {string} */(attributeName).startsWith('data-')) {
          const name = /** @type {string} */(attributeName).slice(5).replace(re, place);
          interceptor(
            /** @type {HTMLElement} */(target),
            name,
            oldValue,
            /** @type {HTMLElement} */(target).dataset[name]
          );
        }
      }
    });
  }

  /**
   * Automatically adds `attributes:true` and `attributeOldValue:true`.
   * Allows setting the `subtree` value without hooking into childList.
   * @param {HTMLElement} target
   * @param {{ subtree?: boolean }} [options]
   */
  observe(target, options) {
    super.observe(target, { ...defaults, subtree: !!options?.subtree });
  }
}
