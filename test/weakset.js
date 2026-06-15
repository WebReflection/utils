import WeakSet from '../src/weakset.js';

const set = new WeakSet();

const value = {};

console.assert(set.put(value) === value);
