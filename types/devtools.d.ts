/**
 * @param {string} css the CSS selector to query
 * @param {Document | DocumentFragment | Element} [root] the optional parent node to query
 * @returns
 */
export declare const $: (css: string, root?: Document | DocumentFragment | Element) => Element | null;
/**
 * @param {string} css the CSS selector to query
 * @param {Document | DocumentFragment | Element} [root] the optional parent node to query
 * @returns
 */
export declare const $$: (css: string, root?: Document | DocumentFragment | Element) => NodeListOf<Element>;
/**
 * @param {string} path the XPath selector to evaluate
 * @param {Document | DocumentFragment | Element} [root] the optional parent node to query
 * @returns
 */
export declare const $x: (path: string, root?: Document | DocumentFragment | Element) => (Node | null)[];
