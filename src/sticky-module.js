//@ts-check

const { defineProperty } = Object;
const { for: symbolFor } = Symbol;

/**
 * Allow leaking a module globally to help avoid conflicting exports
 * if the module might have been re-bundled in other projects.
 * @template T
 * @param {string} name the module name to save or retrieve
 * @param {T} value the module as value to save if not known
 * @param {globalThis} [global=globalThis] the reference where modules are saved where `globalThis` is the default
 * @returns {[T, boolean]} the passed `value` or the previous one as first entry, a boolean indicating if it was known or not
 */
export default (name, value, global = globalThis) => {
  /** @type {symbol} */
  const symbol = symbolFor(name);
  const known = symbol in global;
  return [
    known ?
      // @ts-ignore
      global[symbol] :
      // @ts-ignore
      defineProperty(global, symbol, { value })[symbol],
    known,
  ];
};
