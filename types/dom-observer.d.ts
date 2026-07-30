/**
 * This helper provides a unique observer for the whole DOM,
 * including all shadow roots. This should be used to register
 * multiple subscribers that would like to track added or removed nodes
 * within shadow roots or the main document.
 */
import WeakMap from './weakmap.js';
export type Subscriber = (mutations: MutationRecord[]) => void;
/** @typedef {(mutations: MutationRecord[]) => void} Subscriber */
/** @type {WeakMap<Node, ShadowRoot>} */
export declare const shadows: WeakMap<Node, ShadowRoot>;
/** @type {Set<Subscriber>} */
export declare const subscribers: Set<Subscriber>;
