# @webreflection/utils

Each utility can be loaded from a *CDN* via either `https://esm.run/@webreflection/utils/{{UTILITY}}` or `https://cdn.jsdelivr.net/npm/@webreflection/utils/src/{{UTILITY}}.js`.


This document describes each utility separately.


## all

A `Promise.all` companion with one extra convenience: when called with a
single object literal, it resolves each value and returns an object with the
same keys.

```js
import all from '@webreflection/utils/all';

const user = await all({
  name: fetchName(),
  age: fetchAge()
});

// { name: 'Ada', age: 36 }
```

This preserves the shape and names of object-literal work, avoiding the
positional array juggling required by `Promise.all`. For arrays, or for two or
more arguments, it behaves like `Promise.all` and resolves to an array.


## ascii

An extremely small string to `Uint8Array` converter for known ASCII-compatible
content. It does not validate or encode Unicode code points; it simply stores
each string unit as its `0-255` char code.

This is meant for niche cases where the input is already constrained, such as
ISO date strings, plain-English global names or method names, and other small
ad-hoc values.

```js
import { encode, decode } from '@webreflection/utils/ascii';

console.log(decode(encode('ASCII')));
// ASCII
```

Please note that decoding also fails for inputs bigger than about 64K bytes, or
whatever argument limit your runtime has for `String.fromCharCode`.


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


## json-storage

A *Map* like API that is compatible out of the box with *JSON API*.

```js
import JSONStorage from '@webreflection/utils/json-storage';

const localJSONStorage = new JSONStorage;

// insert if not present an object and returns it
localJSONStorage.getOrInsert('key', { complex: true }).complex;

localJSONStorage.get('key').complex; // true
```

The storage can be a session one via `new JSONStorage(JSONStorage.SESSION)` and it can optionally accept a different api from native *JSON* as long as both `parse` and `stringify` are implemented.



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

Because the sticky logic is intentionally simple, using a "*first come, first served*" global symbol lookup, avoid storing sensitive values there directly when secrecy or module-level isolation matters.


## with-resolvers

This utility returns a self-bound `Promise.withResolvers()` implementation that also works on older Android WebView runtimes.

```js
import withResolvers from '@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();

setTimeout(resolve, 0, 42);

export default promise;
```
