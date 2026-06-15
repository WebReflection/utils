import Map from '../src/map.js';

const map = new Map();

console.assert(map.put('foo', 'bar') === 'bar');
