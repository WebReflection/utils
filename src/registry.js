// @ts-check

/**
 * @template Type
 * @typedef {((value: unknown) => value is Type) | ((value: unknown) => boolean)} RegistryValidator
 */

/**
 * @template [Key=unknown]
 * @template [Value=unknown]
 * @typedef {object} RegistryOptions
 * @property {RegistryValidator<Key>} [key] Accepts or rejects candidate keys.
 * @property {RegistryValidator<Value>} [value] Accepts or rejects candidate values.
 * @property {boolean} [unique] When true, stored keys cannot be replaced or removed.
 */

/**
 * @param {unknown[]} parts
 */
const fail = (...parts) => {
  throw new TypeError(parts.map(String).join(' '));
};

/** @type {RegistryOptions} */
const defaultOptions = {
  key: _ => true,
  value: _ => true,
  unique: true,
};

/**
 * Map with optional key/value validation and permanent-key protection.
 *
 * When unique keys are enabled, stored keys cannot be replaced or deleted.
 *
 * @template [Key=unknown]
 * @template [Value=unknown]
 * @extends {Map<Key, Value>}
 */
export default class Registry extends Map {
  /** @type {RegistryValidator<Key>} */
  #key;

  /** @type {RegistryValidator<Value>} */
  #value;

  /** @type {boolean} */
  #unique;

  /**
   * @param {Iterable<[Key, Value]> | null} [iterable]
   * @param {RegistryOptions<Key, Value>} [options]
   * @throws {TypeError} If an initial entry violates validation or uniqueness.
   */
  constructor(
    iterable,
    options = {}
  ) {
    super();
    const {
      key = /** @type {RegistryValidator<Key>} */ (defaultOptions.key),
      value = /** @type {RegistryValidator<Value>} */ (defaultOptions.value),
      unique = defaultOptions.unique
    } = options;
    this.#key = key;
    this.#value = value;
    this.#unique = !!unique;
    for (const [key, value] of iterable ?? []) this.set(key, value);
  }

  /**
   * Remove a key when unique-key protection is disabled.
   *
   * @param {Key} key
   * @returns {boolean}
   * @throws {TypeError} If the key exists and unique-key protection is enabled.
   */
  delete(key) {
    if (this.#unique && super.has(key)) fail('Unable to remove key:', key);
    return super.delete(key);
  }

  /**
   * @param {Key} key
   * @param {Value} value
   * @returns {this}
   * @throws {TypeError} If the key, value, or uniqueness check fails.
   */
  set(key, value) {
    if (!this.#key(key)) fail('Invalid key:', key);
    if (this.#unique && super.has(key)) fail('Duplicate key:', key);
    if (!this.#value(value)) fail('Invalid value:', value);
    return super.set(key, value);
  }
}
