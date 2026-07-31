/**
 * Unique document-wide MutationObserver (including shadow roots) for multiple
 * subscribers tracking added or removed nodes. Setup runs once per realm via
 * sticky; later module copies reuse the same `subscribers` and `shadows`.
 * Requires a DOM (`document`, `MutationObserver`, `Element`).
 */
import WeakMap from '../weak/map.js';
export type Subscriber = (mutations: MutationRecord[]) => void;
/** @typedef {(mutations: MutationRecord[]) => void} Subscriber */
declare const shadows: WeakMap<Node, ShadowRoot>, subscribers: Set<Subscriber>;
export { shadows, subscribers };
