//@ts-check

/**
 * @template T
 * @typedef {{promise: Promise<T>, resolve: (value: T | PromiseLike<T>) => void, reject: (reason?: any) => void}} Resolvers
 */

// fallback for Android WebView
/**
 * @template T
 * @this {PromiseConstructor}
 * @returns {Resolvers<T>}
 */
function withResolvers() {
  var a, b, c = new this((resolve, reject) => {
    a = resolve;
    b = reject;
  });
  // @ts-ignore
  return { resolve: a, reject: b, promise: c };
}


export default /** @type {<T>() => Resolvers<T>} */((
  /** @type {PromiseConstructor & {withResolvers?: <T>() => Resolvers<T>}} */ (Promise).withResolvers ||
  withResolvers
).bind(Promise));
