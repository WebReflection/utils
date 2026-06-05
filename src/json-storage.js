// @ts-check

const { entries, keys, values } = Object;

/** @type {typeof Symbol.iterator} */
const iterator = Symbol.iterator;

const LOCAL = 'local';
const SESSION = 'session';

/**
 * @typedef {typeof LOCAL | typeof SESSION} JSONStorageKind
 */

/**
 * @template Value
 * @typedef {{
 *   parse(source: string): Value,
 *   stringify(value: Value): string
 * }} JSONStorageAPI
 */

/**
 * @typedef {{
 *   clear(): void,
 *   getItem(key: string): string | null,
 *   removeItem(key: string): void,
 *   setItem(key: string, value: string): void,
 *   [Symbol.iterator](): Generator<[string, string], void, unknown>,
 * }} StorageAPI
 */

/**
 * @template Value
 * @param {JSONStorage<Value>} self
 * @param {string} key
 * @param {Value} value
 * @returns {Value}
 */
const add = (self, key, value) => {
  self.set(key, value);
  return value;
};

/**
 * Map-like facade over `localStorage` or `sessionStorage` that stores values
 * through a JSON-compatible `parse`/`stringify` pair.
 *
 * @template [Value=unknown]
 * @implements {Iterable<[string, Value]>}
 */
export default class JSONStorage {
  /** @type {typeof LOCAL} */
  static LOCAL = LOCAL;

  /** @type {typeof SESSION} */
  static SESSION = SESSION;

  /** @type {StorageAPI} */
  #storage;

  /** @type {(value: Value) => string} */
  #stringify;

  /** @type {(source: string) => Value} */
  #parse;

  /**
   * @param {JSONStorageKind} [storage=LOCAL]
   * @param {JSONStorageAPI<Value>} [json=JSON]
   */
  constructor(storage = LOCAL, { parse, stringify } = /** @type {JSONStorageAPI<Value>} */ (JSON)) {
    // @ts-ignore
    this.#storage = storage === LOCAL ? localStorage : sessionStorage;
    this.#stringify = stringify;
    this.#parse = parse;
  }

  /** @returns {void} */
  clear() {
    this.#storage.clear();
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  delete(key) {
    const had = this.has(key);
    if (had) this.#storage.removeItem(key);
    return had;
  }

  /**
   * @param {string} key
   * @returns {Value | undefined}
   */
  get(key) {
    const value = this.#storage.getItem(key);
    return value != null ? this.#parse(value) : void 0;
  }

  /**
   * @param {string} key
   * @param {Value} value
   * @returns {Value}
   */
  getOrInsert(key, value) {
    const current = this.get(key);
    return current !== void 0 ? current : add(this, key, value);
  }

  /**
   * @template {string} Key
   * @param {Key} key
   * @param {(key: Key) => Value} callback
   * @returns {Value}
   */
  getOrInsertComputed(key, callback) {
    const current = this.get(key);
    return current !== void 0 ? current : add(this, key, callback(key));
  }

  /**
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.#storage.getItem(key) != null;
  }

  /**
   * @param {string} key
   * @param {Value} value
   * @returns {this}
   */
  set(key, value) {
    const str = this.#stringify(value);
    if (str != null) this.#storage.setItem(key, str);
    return this;
  }

  /** @returns {Generator<[string, Value], void, unknown>} */
  *entries() {
    yield* this[iterator]();
  }

  /** @returns {Generator<string, void, unknown>} */
  *keys() {
    yield* keys(this.#storage);
  }

  /** @returns {Generator<Value, void, unknown>} */
  *values() {
    for (const value of values(this.#storage)) {
      // @ts-ignore
      yield this.#parse(value);
    }
  }

  /** @returns {Generator<[string, Value], void, unknown>} */
  *[iterator]() {
    for (const [key, value] of entries(this.#storage)) {
      // @ts-ignore
      yield [key, this.#parse(value)];
    }
  }
}
