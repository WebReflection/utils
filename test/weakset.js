import WeakSet from '../src/weak/set.js';

const set = new WeakSet();

const value = {};

console.assert(set.put(value) === value);
