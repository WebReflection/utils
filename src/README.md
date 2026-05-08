# @webreflection/utils

Each utility can be loaded from a *CDN* via either `https://esm.run/@webreflection/utils/{{UTILITY}}` or `https://cdn.jsdelivr.net/npm/@webreflection/utils/src/{{UTILITY}}.js`.


This document describes each utility separately.

## bound-once

This is equivalent to **bound**, except each bound method is created only once. It is useful when bound method identity must be preserved across multiple calls.

This variant uses **sticky** to ensure that weakly referenced targets always produce the same bound method within the same realm.

## bound

This utility provides an object-destructuring syntax shortcut for binding methods.

```js
import bound from '@webreflection/utils/bound';

const { all, resolve } = bound(Promise);
all([1, 2, 3]);
resolve(4);
```

The **bound-once** variant ensures that repeated accesses, such as `boundOnce(Promise).all`, always return the same bound method.

## shared-array-buffer

This utility provides an unobtrusive *SAB* (*SharedArrayBuffer*) shim based on the default *ArrayBuffer*, with `grow(length)` and `growable` additions.

This class can be used to simulate *SAB* capabilities.

The module exports both `SharedArrayBuffer` and `native`. The `native` *boolean* indicates whether the returned constructor is the platform implementation or the shim.

## sticky

Based on `Symbol.for(name)`, this utility helps modules that might be embedded multiple times across projects avoid conflicts in their internal logic. It preserves the assumption that a module is imported only *once* per application.

```js
import sticky from '@webreflection/utils/sticky';

// will be created and discarded ASAP
// if embedded multiple times
const computed = new WeakMap;

// module will always point at the very first computed
const [module, known] = sticky(
  '@my-project/known-references',
  ref => {
    // ensure this reference is processed only once in this realm
    if (computed.has(ref)) return computed.get(ref);

    // compute the value once, then reuse it on future calls
    const costlyComputation = somethingNeededOnce(ref);
    computed.set(ref, costlyComputation);
    return costlyComputation;
  },
);

if (known) console.warn('embedded multiple times');

export default module;
```


## with-resolvers

This utility returns a self-bound `Promise.withResolvers()` implementation that also works on older Android WebView runtimes.

```js
import withResolvers from '@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();

setTimeout(resolve, 0, 42);

export default promise;
```
