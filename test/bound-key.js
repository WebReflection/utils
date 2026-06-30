import boundKey from '../src/bound-key.js';

function test() {
  return `Hello ${this}!`;
}

const [bound] = boundKey(test);

const world = bound('world');

console.assert(world() === 'Hello world!');
console.assert(bound('world') === world);
