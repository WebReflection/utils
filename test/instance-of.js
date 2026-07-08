import instanceOf from '../src/instance-of.js';

const classes = [
  WeakMap,
];

console.assert(instanceOf(new WeakMap(), classes) === WeakMap);
console.assert(instanceOf({}, classes) === Object);
console.assert(instanceOf([], classes) === Array);
