const { hasOwn } = Object;

Object.hasOwn = void 0;

const { default: test } = await import('../src/has-own.js');

console.assert(test({}, 'a') === false, 'test({}, "a") === false');
console.assert(test({ a: 1 }, 'a') === true, 'test({ a: 1 }, "a") === true');

Object.hasOwn = hasOwn;
