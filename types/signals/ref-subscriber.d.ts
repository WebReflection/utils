/**
 * @param {WeakKey} ref
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export declare const subscribe: (ref: WeakKey, signal: import('./index.js').Signal<unknown>, callback: import('./index.js').Subscriber) => import("./index.js").Subscriber;
/**
 * @param {WeakKey} ref
 * @param {import('./index.js').Signal<unknown>} signal
 * @param {import('./index.js').Subscriber} callback
 */
export declare const unsubscribe: (ref: WeakKey, signal: import('./index.js').Signal<unknown>, callback: import('./index.js').Subscriber) => boolean;
