import define from './define.js';

/**
 * Polyfill for {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set/union Set.prototype.union}
 * when missing. Accepts a set-like `other` (`size`, `has`, `keys`) per the spec;
 * defined only if the engine does not already provide `union`.
 */
define(Set.prototype, 'union', function union(other) {
  const result = new Set(this);
  for (const value of other.keys())
    result.add(value);
  return result;
});
