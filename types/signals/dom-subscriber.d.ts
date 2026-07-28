/**
 * @param {Node} node
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export declare const subscribe: (node: Node, signal: import('./index.js').Signal<unknown>, callback: import('./index.js').Subscriber) => import("./index.js").Subscriber;
/**
 * @param {Node} node
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export declare const unsubscribe: (node: Node, signal: import('./index.js').Signal<unknown>, callback: import('./index.js').Subscriber) => any;
