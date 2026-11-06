// @ts-check

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
   * @param {(target:HTMLElement, name:string, oldValue:string|undefined|null, newValue:string|undefined|null) => void} interceptor 
   */
  constructor(interceptor) {
    super(mutations => {
      for (const { target, attributeName, oldValue } of mutations) {
        if (attributeName?.startsWith('data-')) {
          const name = attributeName.slice(5).replace(re, place);
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
   * @param {HTMLElement} target 
   * @param {{ subtree?: boolean, childList?: boolean }} [options]
   */
  observe(target, options) {
    super.observe(target, { ...defaults, ...options });
  }
}
