import WeakMap from '../src/weakmap.js';

const map = new WeakMap();

const key = {};

console.assert(map.put(key, 'bar') === 'bar');
