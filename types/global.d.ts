export default global;
/**
 * Lazily trapped view of {@link globalThis}. Import this module as early as
 * possible in the page or bundle so native constructors, prototypes, and other
 * globals are snapshotted before third-party scripts can replace or pollute them.
 *
 * The first script that reads a property through this export receives a
 * one-time, reliable copy of that value. Non-null objects are trapped
 * recursively, so deeper references such as `Object.prototype.toString` stay
 * faithful to the moment they were first accessed, even if the live
 * `globalThis` or its prototypes are later reassigned or augmented.
 */
declare const global: typeof globalThis;
