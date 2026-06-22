import plainTag from '../src/plain-tag.js';

console.assert(plainTag`Hello, ${'world'}!` === 'Hello, world!');
