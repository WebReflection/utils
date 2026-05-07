import bound from '../src/bound-once.js';

const obj = {
  /** @type {number} */
  a: 1,
  /** @param {number} b */
  method(b) {
    return this.a + b;
  },
  self() {
    return this;
  },
};

const { method, self } = bound(obj);

console.assert(method(2) === 3);
console.assert(self() === obj);

console.assert(method === bound(obj).method);
console.assert(self === bound(obj).self);
