import dispose from '../src/patch/dispose.js';

console.assert(typeof dispose === 'symbol');
console.assert(
  dispose === (Symbol.dispose ?? Symbol.for('dispose')),
  'matches native Symbol.dispose when present, else Symbol.for("dispose")',
);

const nativeUnion = Set.prototype.union;
const hadUnion = typeof nativeUnion === 'function';
if (hadUnion) delete Set.prototype.union;

await import('../src/patch/set-union.js');

const a = new Set([1, 2]);
const b = new Set([2, 3]);
console.assert(
  [...a.union(b)].join(',') === '1,2,3',
  'Set.prototype.union polyfill unions two sets',
);

const like = {
  size: 2,
  has(value) { return value === 3 || value === 4; },
  keys() { return [3, 4][Symbol.iterator](); },
};
console.assert(
  [...a.union(like)].join(',') === '1,2,3,4',
  'Set.prototype.union polyfill accepts set-like other via keys()',
);

if (hadUnion) {
  Object.defineProperty(Set.prototype, 'union', {
    configurable: true,
    writable: true,
    value: nativeUnion,
  });
}
