import WeakMap from '../src/weak/map.js';

const map = new WeakMap();

const key = {};

console.assert(map.put(key, 'bar') === 'bar');
