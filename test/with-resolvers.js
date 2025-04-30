import withResolvers from '../src/with-resolvers.js';

const { promise, resolve, reject } = withResolvers();

console.assert(typeof reject === 'function');
console.assert(typeof resolve === 'function');
console.assert(promise instanceof Promise);

resolve('OK');

console.log(await promise);
