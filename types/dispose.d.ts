/**
 * `Symbol.dispose` when available (Chromium, Edge, Firefox, …), otherwise
 * `Symbol.for('dispose')` for engines that do not expose it yet (e.g. Safari /
 * WebKit). This is not a polyfill: it never defines `Symbol.dispose`.
 * @type {symbol}
 */
declare const _default: symbol;
export default _default;
