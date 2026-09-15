// @ts-ignore
function Handler(value) {
  // @ts-ignore
  this._ = value;
}

for (const trap of Reflect.ownKeys(Reflect)) {
  if (typeof trap === 'string') {
    // @ts-ignore
    Handler.prototype[trap] = function (_, field) {
      if (trap !== 'get' || field !== 'then') {
        // @ts-ignore
        const method = this._[trap] ?? Reflect[trap];
        return method.apply(this._, arguments);
      }
    }
  }
}

export default /** @type {ProxyConstructor} */(
  /** @type {unknown} */(
    // @ts-ignore
    function (target, handler) {
      // @ts-ignore
      return new Proxy(target, new Handler(handler));
    }
  )
);
