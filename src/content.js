// @ts-check
/// <reference lib="dom" />

const { entries } = Object;

/**
 * Create a map of content factories, one per entry in `contents`. Each factory
 * parses a markup string in the context of its associated node and returns the
 * produced nodes as a `DocumentFragment`.
 *
 * The parsing context is just an element, so this works with any namespace
 * reachable through `createElementNS` (HTML, SVG, MathML, ...). Keys are
 * free-form names you choose to label each context, hence the generic shape.
 *
 * @template {Record<string, Element>} T
 * @param {T} contents a map of arbitrary names to the element whose contents
 *  are selected as the parsing context for that name
 * @param {Document} [document=globalThis.document] the document used to create
 *  the working range, where `globalThis.document` is the default
 * @returns {{ [K in keyof T]: (value: string) => DocumentFragment }} a map with
 *  the same keys as `contents`, each value being a factory that parses a markup
 *  string into a `DocumentFragment`
 */
export default (contents, document = globalThis.document) => {
  /** @type {string} */
  let current = '';

  /** @type {Record<string, (value: string) => DocumentFragment>} */
  const content = {};

  const range = document.createRange();

  for (const [key, node] of entries(contents)) {
    content[key] = value => {
      if (current !== key) {
        current = key;
        range.selectNodeContents(node);
      }
      return range.createContextualFragment(value);
    };
  }
  return /** @type {{ [K in keyof T]: (value: string) => DocumentFragment }} */ (
    content
  );
};
