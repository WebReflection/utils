// @ts-check

const { create, freeze } = Object;

/** A frozen, shared empty array. */
export const array = /** @type {readonly never[]} */ (freeze([]));

/** A frozen, shared empty object with a `null` prototype. */
export const nil = /** @type {Readonly<Record<string, never>>} */ (freeze(create(null)));

/** A frozen, shared empty object. */
export const object = /** @type {Readonly<Record<string, never>>} */ (freeze({}));
