/**
 * Map with optional key/value validation and permanent-key protection.
 *
 * When unique keys are enabled, stored keys cannot be replaced or deleted.
 *
 * @template [Key=unknown]
 * @template [Value=unknown]
 * @extends {Map<Key, Value>}
 */
export default class Registry<Key = unknown, Value = unknown> extends Map<Key, Value> {
    /**
     * @param {Iterable<[Key, Value]> | null} [iterable]
     * @param {RegistryOptions<Key, Value>} [options]
     * @throws {TypeError} If an initial entry violates validation or uniqueness.
     */
    constructor(iterable?: Iterable<[Key, Value]> | null, options?: RegistryOptions<Key, Value>);
    /**
     * @param {Key} key
     * @param {Value} value
     * @returns {this}
     * @throws {TypeError} If the key, value, or uniqueness check fails.
     */
    set(key: Key, value: Value): this;
    #private;
}
export type RegistryValidator<Type> = ((value: unknown) => value is Type) | ((value: unknown) => boolean);
export type RegistryOptions<Key = unknown, Value = unknown> = {
    /**
     * Accepts or rejects candidate keys.
     */
    key?: RegistryValidator<Key> | undefined;
    /**
     * Accepts or rejects candidate values.
     */
    value?: RegistryValidator<Value> | undefined;
    /**
     * When true, stored keys cannot be replaced or removed.
     */
    unique?: boolean | undefined;
};
