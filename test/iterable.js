import iterable from '../src/iterable.js';

const obj = { o: 'k' };

console.assert([...iterable(iterable(obj))].join(',') === 'o,k', '[...iterable(obj)].join(",") === "o,k"');
