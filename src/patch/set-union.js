import define from './define.js';

define(Set.prototype, 'union', function union(other) {
  return new Set([...this, ...other]);
});
