// @ts-check

/**
 * @template K,V
 * @extends Map<K,V>
 */
export default class Cache extends Map {
  /**
   * @template K,V
   * @type {(self: Cache<K,V>) => void}
   */
  #cleanup = () => {
    this.#run = true;
    this.#queue.splice(0).forEach(this.delete, this);
  };

  /** @type {number} */
  #delay;

  /** @type {K[]} */
  #queue = [];

  /** @type {boolean} */
  #run = true;

  /**
   * @param {K} key
   */
  #push(key) {
    this.#queue.push(key);
    if (this.#run) {
      this.#run = false;
      if (this.#delay < 1) {
        // @ts-ignore
        queueMicrotask(this.#cleanup);
      }
      else {
        // @ts-ignore
        setTimeout(this.#cleanup, this.#delay);
      }
    }
  }

  clear() {
    this.#queue.splice(0);
    super.clear();
  }

  /**
   * @param {number} [delay]
   */
  constructor(delay = 0) {
    super();
    this.#delay = delay;
  }

  /**
   * @param {K} key
   * @param {V} value
   * @returns
   */
  getOrInsert(key, value) {
    const known = this.get(key);
    return known === void 0 && !this.has(key) ? this.put(key, value) : known;
  }

  /**
   * @param {K} key
   * @param {(key: K) => V} callback
   * @returns
   */
  getOrInsertComputed(key, callback) {
    const known = this.get(key);
    return known === void 0 && !this.has(key) ? this.put(key, callback(key)) : known;
  }

  /**
   * This method is slightly faster than `getOrInsert` or `getOrInsertComputed`
   * but it does not check if the key already exists, possibly pushing it twice.
   * However, doing `ref.get(key) ?? ref.put(key, value)` provides same functionality as
   * `ref.getOrInsert(key, value)` or `ref.getOrInsertComputed(key, callback)`.
   * @param {K} key
   * @param {V} value
   * @returns
   */
  put(key, value) {
    this.#push(key);
    super.set(key, value);
    return value;
  }

  /**
   * @param {K} key
   * @param {V} value
   * @returns
   */
  set(key, value) {
    if (!this.has(key)) this.#push(key);
    return super.set(key, value);
  }
}
