import id from '../src/id.js';

const next = id();

console.assert(next() === 0);
console.assert(next() === 1);
console.assert(next() === 2);
console.assert(next() === 3);
console.assert(next() === 4);
console.assert(next() === 5);
console.assert(next() === 6);
console.assert(next() === 7);
console.assert(next() === 8);
console.assert(next() === 9);

const roundtrip = id(2 ** 31 - 1);
console.assert(roundtrip() === 2147483647);
console.assert(roundtrip() === -2147483648);
