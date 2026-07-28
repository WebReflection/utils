import dispose from '../src/dispose.js';

console.assert(typeof dispose === 'symbol');
console.assert(
  dispose === (Symbol.dispose ?? Symbol.for('dispose')),
  'matches native Symbol.dispose when present, else Symbol.for("dispose")',
);
