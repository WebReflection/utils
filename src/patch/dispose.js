//@ts-check

/* c8 ignore start */
/**
 * `Symbol.dispose` when available (Chromium, Edge, Firefox, …), otherwise
 * `Symbol.for('dispose')` for engines that do not expose it yet (e.g. Safari /
 * WebKit). This is not a polyfill: it never defines `Symbol.dispose`.
 * @type {symbol}
 */
// @ts-ignore well-known symbol may be missing from older lib targets
export default Symbol.dispose ?? Symbol.for('dispose');
/* c8 ignore stop */
