import Proxy from '../src/unthenable.js';

class Test {
  #private = true;

  get(target, name) {
    return target[name];
  }

  has(target, name) {
    return this.#private && name in target;
  }
}

let p = new Proxy(
  { test: 123 },
  new Test
);

console.assert('test' in p);
console.assert(!('nope' in p));
console.assert(await p === p);
console.assert(p.test === 123);
console.assert(p.nope === undefined);
console.assert(p instanceof Object);
