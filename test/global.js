import global from '../src/global.js';

const O = Object;

globalThis.__trapTest = { nested: { x: 1 } };
const nested = global.__trapTest.nested;
globalThis.__trapTest.nested = { x: 999 };
console.assert(nested.x === 1);

Object.prototype.shenanigans = null;

const { Object: { prototype } } = global;
const { toString, shenanigans } = prototype;

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
console.assert(global.Object.prototype.toString === previously, 'previously');
console.assert(global.Object.prototype.toString === toString, 'toString');
console.assert(global.Object.prototype.toString !== Object.prototype.toString, 'toString');
console.assert(global.Object.prototype.shenanigans === null, 'shenanigans');
console.assert(global.Object.name === 'Object', 'name');

try {
  global.Object.test = 'fail';
  throw new Error('classes should be trapped');
}
catch {}

console.assert(global.Object.prototype === prototype, 'prototype');

console.assert(global.Object(new global.Object) instanceof global.Object, 'Object(new Object) instanceof Object');
