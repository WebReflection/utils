/**
 * Map with optional key/value validation and duplicate-key protection.
 *
 * @template [Key=unknown]
 * @template [Value=unknown]
 * @extends {Map<Key, Value>}
 */
export default class Registry<Key = unknown, Value = unknown> extends Map<Key, Value> {
    /**
     * @param {Iterable<[Key, Value]> | null} [iterable]
     * @param {RegistryOptions<Key, Value>} [options]
     */
    constructor(iterable?: Iterable<[Key, Value]> | null, options?: RegistryOptions<Key, Value>);
    /**
     * @param {Key} key
     * @param {Value} value
     * @returns {this}
     */
    set(key: Key, value: Value): this;
    #private;
}
export type RegistryValidator<Type> = ((value: unknown) => value is Type) | ((value: unknown) => boolean);
export type RegistryOptions<Key = unknown, Value = unknown> = {
    key?: RegistryValidator<Key>;
    value?: RegistryValidator<Value>;
    unique?: boolean;
};
