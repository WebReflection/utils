/**
 * Map-like facade over `localStorage` or `sessionStorage` that stores values
 * through a JSON-compatible `parse`/`stringify` pair.
 *
 * @template [Value=unknown]
 * @implements {Iterable<[string, Value]>}
 */
export default class JSONStorage<Value = unknown> implements Iterable<[string, Value]> {
    /** @type {typeof LOCAL} */
    static LOCAL: typeof LOCAL;
    /** @type {typeof SESSION} */
    static SESSION: typeof SESSION;
    /**
     * @param {JSONStorageKind} [storage=LOCAL]
     * @param {JSONStorageAPI<Value>} [json=JSON]
     */
    constructor(storage?: JSONStorageKind, { parse, stringify }?: JSONStorageAPI<Value>);
    /** @returns {void} */
    clear(): void;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    delete(key: string): boolean;
    /**
     * @param {string} key
     * @returns {Value | undefined}
     */
    get(key: string): Value | undefined;
    /**
     * @param {string} key
     * @param {Value} value
     * @returns {Value}
     */
    getOrInsert(key: string, value: Value): Value;
    /**
     * @template {string} Key
     * @param {Key} key
     * @param {(key: Key) => Value} callback
     * @returns {Value}
     */
    getOrInsertComputed<Key extends string>(key: Key, callback: (key: Key) => Value): Value;
    /**
     * @param {string} key
     * @returns {boolean}
     */
    has(key: string): boolean;
    /**
     * @param {string} key
     * @param {Value} value
     * @returns {Value}
     */
    put(key: string, value: Value): Value;
    /**
     * @param {string} key
     * @param {Value} value
     * @returns {this}
     */
    set(key: string, value: Value): this;
    /** @returns {Generator<[string, Value], void, unknown>} */
    entries(): Generator<[string, Value], void, unknown>;
    /** @returns {Generator<string, void, unknown>} */
    keys(): Generator<string, void, unknown>;
    /** @returns {Generator<Value, void, unknown>} */
    values(): Generator<Value, void, unknown>;
    /** @returns {Generator<[string, Value], void, unknown>} */
    [Symbol.iterator](): Generator<[string, Value], void, unknown>;
    #private;
}
export type JSONStorageKind = typeof LOCAL | typeof SESSION;
export type JSONStorageAPI<Value> = {
    parse(source: string): Value;
    stringify(value: Value): string;
};
export type StorageAPI = {
    clear(): void;
    getItem(key: string): string | null;
    removeItem(key: string): void;
    setItem(key: string, value: string): void;
    [Symbol.iterator](): Generator<[string, string], void, unknown>;
};
declare const LOCAL: "local";
declare const SESSION: "session";
export {};
