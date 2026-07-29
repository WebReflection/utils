// @ts-check

import accessor from '../src/accessor.js';

// Standalone accessor: `this` in get/set is the descriptor object itself.
/** @type {import('../types/accessor.js').AccessorFn<number>} */
const value = accessor({
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

console.assert(value() === 42);

console.assert(value(43) === undefined);

console.assert(value() === 43);

// Host property accessor: `this` in get/set is the host object.
const object = /** @type {{ _: number, value: import('../types/accessor.js').AccessorFn<number> }} */ (
  Object.defineProperty({ _: 42 }, 'value', {
    enumerable: true,
    writable: true,
    value: accessor({
      /** @this {{ _: number }} */
      get() {
        return this._;
      },
      /** @this {{ _: number }} */
      set(/** @type {number} */ value) {
        this._ = value;
      },
    })
  })
);

console.assert(object.value() === 42);

console.assert(object.value(43) === undefined);

console.assert(object.value() === 43);

console.assert(object._ === 43);
