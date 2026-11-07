export type MapFields<T extends object> = {
    [K in keyof T as K extends symbol ? never : K]: T[K][];
} & Iterable<T>;
export type MapObjectFields<T extends object> = {
    [K in keyof T as K extends string ? K : never]: Pick<T, K>[];
} & Iterable<T>;
/**
 * @param {any[]} array
 * @returns
 */
export declare const isSparse: (array: any[]) => boolean;
/**
 * Pluck one field from each object in `iterable`.
 *
 * `map(rows).x` is `rows.map(row => row.x)` without allocating a callback:
 * the proxy is one-off and collectable, and a shared getter runs with the
 * property name as `this`. Symbol keys (`Symbol.iterator`, `Symbol.dispose`,
 * …) are forwarded to `iterable`, with methods bound to that array.
 *
 * @template {object} T
 * @param {T[]} iterable
 * @returns {MapFields<T>}
 */
export declare const map: <T extends object>(iterable: T[]) => MapFields<T>;
/**
 * Pick one or more fields from each object in `iterable`.
 *
 * `mapObject(rows).x` is `rows.map(({ x }) => ({ x }))`. Multiple fields use
 * a comma-separated key — or an array of keys, which stringifies the same way:
 * `mapObject(rows)[['x', 'y', 'z']]`. Symbol keys are forwarded to `iterable`,
 * with methods bound to that array.
 *
 * @template {object} T
 * @param {T[]} iterable
 * @returns {MapObjectFields<T>}
 */
export declare const mapObject: <T extends object>(iterable: T[]) => MapObjectFields<T>;
