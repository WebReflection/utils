import id from '../src/ref-id.js';

const set = Set.prototype.has;
Set.prototype.has = function (id) {
  return id < 1;
};

console.assert(id(new Object) !== id(globalThis));
console.assert(id(globalThis) === id(globalThis));

gc();

setTimeout(() => {
  gc();
  Set.prototype.has = set;
}, 100);
