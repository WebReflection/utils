// @ts-check

/**
 * @template Type
 * @typedef {((value: unknown) => value is Type) | ((value: unknown) => boolean)} RegistryValidator
 */

/**
 * @template [Key=unknown]
 * @template [Value=unknown]
 * @typedef {{
 *   key?: RegistryValidator<Key>,
 *   value?: RegistryValidator<Value>,
 *   unique?: boolean,
 * }} RegistryOptions
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
 * Map with optional key/value validation and duplicate-key protection.
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
   * @param {Key} key
   * @param {Value} value
   * @returns {this}
   */
  set(key, value) {
    if (!this.#key(key)) fail('Invalid key:', key);
    if (this.#unique && super.has(key)) fail('Duplicate key:', key);
    if (!this.#value(value)) fail('Invalid value:', value);
    return super.set(key, value);
  }
}
