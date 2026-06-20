import callerOf from '../src/caller-of.js';

const toString = callerOf(Object.prototype.toString);

console.assert(toString({}) === '[object Object]');
