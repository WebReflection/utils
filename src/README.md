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

This variant uses [sticky](#sticky) to ensure that weakly referenced targets always produce the same bound method within the same realm.


## bound

This utility provides an object-destructuring syntax shortcut for binding methods.

```js
import bound from '@webreflection/utils/bound';

const { all, resolve } = bound(Promise);
all([1, 2, 3]);
resolve(4);
```

The **bound-once** variant ensures that repeated accesses, such as `boundOnce(Promise).all`, always return the same bound method.


## iterable

Ensures an object can be consumed by `for...of`, spread, `Array.from`, and
other iterable-aware APIs.

```js
import iterable from '@webreflection/utils/iterable';

const query = iterable({ page: 1, perPage: 20 });

console.log([...query]);
// [['page', 1], ['perPage', 20]]
```

If the object already defines or inherits `Symbol.iterator`, it is returned
unchanged. Otherwise, the same object receives a configurable own
`Symbol.iterator` method that yields `Object.entries(ref)`.


## json-storage

A small *Map* like facade over `localStorage` by default, or `sessionStorage`
when requested. Values are serialized with `JSON.stringify` on write and parsed
with `JSON.parse` on read, so callers can store structured data without
manually converting every value.

```js
import JSONStorage from '@webreflection/utils/json-storage';

const preferences = new JSONStorage;

preferences.set('theme', { dark: true });

console.log(preferences.get('theme').dark);
// true
```

The API follows familiar `Map` names where they make sense: `get`, `set`,
`has`, `delete`, `clear`, `entries`, `keys`, `values`, and default iteration.
Missing keys return `undefined`, while `delete(key)` reports whether the key was
present.

```js
const cart = new JSONStorage(JSONStorage.SESSION);

const items = cart.getOrInsert('items', []);
items.push('book');
cart.set('items', items);

for (const [key, value] of cart) {
  console.log(key, value);
}
```

Use `getOrInsert(key, value)` to create a value only when the key is absent, or
`getOrInsertComputed(key, callback)` when the initial value should be computed
from the key. A second constructor argument can replace the native *JSON* API as
long as it provides compatible `parse(source)` and `stringify(value)` methods.


## registry

A `Map` subclass that validates keys and values before storing them. By default,
keys are permanent: setting the same key twice throws a `TypeError`, and
deleting an existing key also throws so it cannot be re-appended later. Pass
`unique: false` when replacement and deletion should behave like a regular
`Map`.

```js
import Registry from '@webreflection/utils/registry';

const registry = new Registry(null, {
  key: value => typeof value === 'string',
  value: value => typeof value === 'function'
});

registry.set('ready', () => true);

console.log(registry.get('ready')());
// true
```

Both validators receive the candidate value and should return whether it is
allowed. In TypeScript-aware editors, type-predicate validators also define the
resulting `Registry<Key, Value>` shape, so `key` controls the map key type and
`value` controls the stored value type.

```js
const mutable = new Registry(
  [
    ['answer', 41],
    ['answer', 42]
  ],
  {
    key: value => value === 'answer',
    value: value => Number.isInteger(value),
    unique: false
  }
);

console.log(mutable.get('answer'));
// 42

console.log(mutable.delete('answer'));
// true
```

Initial iterable entries are validated with the same rules used by `set()`, so
invalid keys, invalid values, or duplicate keys fail during construction. With
the default `unique: true` behavior, only missing keys can be passed to
`delete()` without throwing, in which case it returns `false` like `Map`.


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
