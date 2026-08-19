export type Resolve<V> = (value?: V | null) => void;
export type Reject = (error?: any | null) => void;
export type Resolvers<V> = {
    promise: Promise<V>;
    resolve: Resolve<V>;
    reject: Reject;
};
export type Next<K, V> = () => [K, Promise<V>];
export type Resolver<K, V> = (uid: K, value?: V | null, error?: any | null) => any;
export type NextResolver<K, V> = [Next<K, V>, Resolver<K, V>];
export default _default;
/**
 * @template V
 * @callback Resolve
 * @param {V?} [value]
 * @returns {void}
 */
/**
 * @callback Reject
 * @param {any?} [error]
 * @returns {void}
 */
/**
 * @template V
 * @typedef {object} Resolvers
 * @prop {Promise<V>} promise
 * @prop {Resolve<V>} resolve
 * @prop {Reject} reject
 */
/**
 * @template K,V
 * @typedef {() => [K, Promise<V>]} Next
 */
/**
 * @template K,V
 * @callback Resolver
 * @param {K} uid
 * @param {V?} [value]
 * @param {any?} [error]
 */
/**
 * @template K,V
 * @typedef {[Next<K,V>, Resolver<K,V>]} NextResolver
 */
/**
 * @template K,V
 * @param {(id: number) => K} [as]
 * @returns
 */
declare function _default<K, V>(as?: (id: number) => K): NextResolver<K, V>;
