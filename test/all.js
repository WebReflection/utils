import assert from 'node:assert/strict';
import all from '../src/all.js';

const object = await all({
  a: 1,
  b: Promise.resolve(2),
  c: Promise.resolve('three')
});

assert.deepEqual(object, {
  a: 1,
  b: 2,
  c: 'three'
});

const array = await all([
  1,
  Promise.resolve(2),
  Promise.resolve('three')
]);

assert.deepEqual(array, [1, 2, 'three']);

const variadic = await all(
  1,
  Promise.resolve(2),
  Promise.resolve('three')
);

assert.deepEqual(variadic, [1, 2, 'three']);
