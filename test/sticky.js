import stickyModule from '../src/sticky.js';

let [value, known] = stickyModule('test-sticky-module', 'value');

console.assert(value === 'value');
console.assert(known === false);

[value, known] = stickyModule('test-sticky-module', 'other');
console.assert(value === 'value');
console.assert(known === true);
