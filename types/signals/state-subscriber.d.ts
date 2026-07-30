/**
 * @template {import('./state.js').State} T
 * @param {T} state
 * @param {keyof T & string} key a known property name
 * @param {import('./index.js').Subscriber} callback
 * @returns {import('./index.js').Subscriber | undefined}
 */
export declare const subscribe: <T extends import('./state.js').State>(state: T, key: keyof T & string, callback: import('./index.js').Subscriber) => import('./index.js').Subscriber | undefined;
/**
 * @template {import('./state.js').State} T
 * @param {T} state
 * @param {keyof T & string} key a known property name
 * @param {import('./index.js').Subscriber} callback
 * @returns {boolean}
 */
export declare const unsubscribe: <T extends import('./state.js').State>(state: T, key: keyof T & string, callback: import('./index.js').Subscriber) => boolean;
