import global from '../src/global.js';

globalThis.__trapTest = { nested: { x: 1 } };
const nested = global.__trapTest.nested;
globalThis.__trapTest.nested = { x: 999 };
console.assert(nested.x === 1);

Object.prototype.shenanigans = null;

const { Object: { prototype: { toString, shenanigans } } } = global;

const previously = Object.prototype.toString;
Object.prototype.toString = function (...args) {
  return args.length ? false : previously.call(this);
};

console.assert(toString !== Object.prototype.toString);
console.assert(toString.call([]) === {}.toString.call([]));
console.assert(toString.call([], 1) !== {}.toString.call([], 1));

globalThis.Object = function Object() {};

console.assert(globalThis.Object !== global.Object);
console.assert(globalThis.Object.prototype !== global.Object.prototype);
console.assert(global.Object.prototype.toString === previously);
console.assert(global.Object.prototype.toString === toString);
console.assert(global.Object.prototype.shenanigans === null);
