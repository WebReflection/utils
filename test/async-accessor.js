// @ts-check

import asyncAccessor from '../src/async-accessor.js';

/** @type {import('../types/async-accessor.js').AsyncAccessorFn<number>} */
const value = asyncAccessor({
  /** @type {number} */
  value: 42,
  /** @type {() => number} */
  get() {
    return this.value;
  },
  /** @type {(value: number) => void} */
  set(value) {
    this.value = value;
  },
});

console.assert((await value()) === 42);

console.assert((await value(43)) === undefined);

console.assert((await value()) === 43);

const bare = asyncAccessor({
  /** @type {() => number} */
  get() { return 42; },
  /** @type {(value: number) => void} */
  set(value) {},
});
