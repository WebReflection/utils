// @ts-check

import asyncAccessor from '../src/async-accessor.js';

// Standalone accessor: `this` in get/set is the descriptor object itself.
/** @type {import('../types/async-accessor.js').AsyncAccessorFn<number>} */
const value = asyncAccessor({
  /** @type {number} */
  value: 42,
  /** @this {{ value: number }} */
  get() {
    return this.value;
  },
  /** @this {{ value: number }} */
  set(/** @type {number} */ value) {
    this.value = value;
  },
});

console.assert((await value()) === 42);

console.assert((await value(43)) === undefined);

console.assert((await value()) === 43);

// Host property accessor: `this` in get/set is the host object.
const object = Object.defineProperty({ _: 42 }, 'value', {
  enumerable: true,
  writable: true,
  value: asyncAccessor({
    /** @this {{ _: number }} */
    get() {
      return this._;
    },
    /** @this {{ _: number }} */
    set(/** @type {number} */ value) {
      this._ = value;
    },
  })
});

console.assert((await object.value()) === 42);

console.assert((await object.value(43)) === undefined);

console.assert((await object.value()) === 43);

console.assert(object._ === 43);
