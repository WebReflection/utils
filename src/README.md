# @webreflection/utils

Each utility can be loaded from a *CDN* via either `https://esm.run/@webreflection/utils/UTILITY` or `https://cdn.jsdelivr.net/npm/@webreflection/utils/src/UTILITY.js`.


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


## base64

A small async wrapper around `Uint8Array.prototype.toBase64()` and
`Uint8Array.fromBase64()` for encoding and decoding binary data as strings.
Optional compression is applied through `CompressionStream` and
`DecompressionStream` before or after the base64 step.

```js
// if a polyfill is required for older browsers
import '@ungap/base64';

// this module base64 utility
import { encode, decode } from '@webreflection/utils/base64';

const encoded = await encode('Hello, world!');
const decoded = await decode(encoded);

console.log(decoded);
// Hello, world!
```

Pass the same `format` to both sides when the payload should be compressed
first. Supported formats are `brotli`, `gzip`, `deflate`, `deflate-raw`, and
`zstd` [as mentioned on MDN](https://developer.mozilla.org/en-US/docs/Web/API/CompressionStream/CompressionStream#format).

```js
const compressed = await encode('Hello, world!', { format: 'deflate' });
const decompressed = await decode(compressed, { format: 'deflate' });

console.log(decompressed);
// Hello, world!
```

By default, `decode()` returns a UTF-8 string. Pass `{ buffer: true }` to get
the raw `ArrayBuffer` instead.

```js
const buffer = await decode(compressed, { format: 'deflate', buffer: true });

console.log(new Uint8Array(buffer));
// Uint8Array(13) [ 72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33 ]
```

`encode()` accepts any `BlobPart`, so strings, typed arrays, and `ArrayBuffer`
values all work. Both helpers also accept `alphabet: 'base64url'` and other
options forwarded to the native base64 APIs, such as `omitPadding` on encode and
`lastChunkHandling` on decode.


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


## cache

A temporal `Map` subclass for short-lived memoization. It keeps newly added
entries only until its scheduled cleanup runs, making it useful to reuse
expensive work for repeated access to the same key without keeping the value
around as a long-term cache.

```js
import Cache from '@webreflection/utils/cache';

const users = new Cache;

const loadUser = id => users.getOrInsertComputed(
  id,
  id => fetch(`/users/${id}`).then(response => response.json())
);
```

When the constructor `delay` is omitted, `0`, or less than `0`, cleanup is
queued as a microtask, so same-tick lookups can share the stored value and the
map clears itself before the next task. Pass a positive delay, such as
`new Cache(100)`, to keep entries until a timer removes them instead.

Use `getOrInsert(key, value)` or `getOrInsertComputed(key, callback)` when the
value should only be stored if missing. Use `put(key, value)` for the faster
`cache.get(key) ?? cache.put(key, value)` pattern when duplicate queue entries
are acceptable.


## content

A tiny factory builder for turning markup strings into `DocumentFragment`
instances, where each factory parses in the context of a specific element. The
parsing context is just an element, so any namespace reachable through
`createElementNS` works: HTML, SVG, MathML, and so on.

```js
import content from '@webreflection/utils/content';

const parse = content({
  html: document.createElement('template'),
  svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg')
});

const fragment = parse.html('<div>Hello</div>');
document.body.append(fragment);
```

The passed object maps free-form names to the element whose contents define the
parsing context for that name. The returned object exposes the same keys, each
being a `value => DocumentFragment` factory. A single shared `Range` is reused
across all factories, re-selecting node contents only when the active context
changes, so repeated parsing within the same context stays cheap.

Unlike most DOM utilities here, **content** also accepts an optional second
`document` argument. This is handy in SSR projects where there is no global
`document`, but one can be created with *linkedom*, *jsdom*, or similar and
passed in so the same parsing logic works on the server.

```js
import { parseHTML } from 'linkedom';
import content from '@webreflection/utils/content';

const { document } = parseHTML('<html><body></body></html>');
const parse = content({
  html: document.createElement('template')
}, document);

const fragment = parse.html('<div>Hello</div>');
```

When omitted, the second argument defaults to `globalThis.document`. For the
common HTML and SVG contexts in the browser, see [dom-content](#dom-content).


## dedent

Strip common leading indentation from multiline strings. The utility finds the
first non-empty line, measures its leading whitespace, and removes that same
indentation from every line while leaving everything else unchanged.

It works both as a tagged template and as a plain function on strings. In tag
form, interpolations are joined first via [plain-tag](#plain-tag), then
dedented.

```js
import dedent from '@webreflection/utils/dedent';

console.log(dedent`
  Hello,
  world!
`);
// Hello,
// world!

console.log(dedent(`
  Hello,
  world!
`));
// Hello,
// world!
```

Use the tag form when the string is written inline in source code and should
lose the surrounding indentation. Use the function form when the input is already
a string variable.


## dom-content

A ready-made [content](#content) instance for the two most common contexts,
exposing `html` and `svg` factories backed by a `<template>` element and an
`<svg>` element respectively.

```js
import { html, svg } from '@webreflection/utils/dom-content';

const layout = html('<section><h1>Title</h1></section>');
const icon = svg('<circle cx="10" cy="10" r="5" />');
```

Each helper parses its markup string in the matching context and returns a
`DocumentFragment` ready to be inserted into the DOM. This module relies on the
global `document`, so it is browser-oriented. For SSR, or when a specific
`Document` or additional parsing contexts are required, use
[content](#content) directly and pass the server-side document as its second
argument.


## empty

Frozen, shared empty references for code that needs a guaranteed-empty array,
plain object, or null-prototype object without allocating a new one each time.

```js
import { array, object, nil } from '@webreflection/utils/empty';

const defaults = { ...object, theme: 'light' };
const items = [...array, 'new'];
```

- `array` — a frozen, shared empty array (`readonly never[]`)
- `object` — a frozen, shared empty object (`Readonly<Record<string, never>>`)
- `nil` — a frozen, shared empty object with a `null` prototype


## has-own

A quick and simple polyfill for `Object.hasOwn()` on older browsers. When the
native method is available, it is used directly; otherwise it falls back to
`Object.prototype.hasOwnProperty.call`.

```js
import hasOwn from '@webreflection/utils/has-own';

console.log(hasOwn({ a: 1 }, 'a'));
// true
```


## id

A tiny factory for unique `int32` identifiers. Each call to the returned function
yields the next value, and the counter wraps automatically from `2 ** 31 - 1` to
`-2 ** 31` so it can roundtrip forever without growing past signed 32-bit range.

```js
import id from '@webreflection/utils/id';

const next = id();

console.log(next()); // 0
console.log(next()); // 1

const roundtrip = id(2 ** 31 - 1);

console.log(roundtrip()); // 2147483647
console.log(roundtrip()); // -2147483648
```

Pass an optional starting value when the first issued id should not be `0`.


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


## map

A native `Map` subclass with one extra method: `put(key, value)`. It stores the
entry like `set`, but returns the value instead of the map reference itself.

```js
import Map from '@webreflection/utils/map';

const map = new Map;

const value = map.put('theme', { dark: true });

console.log(value.dark);
// true
```

Use `set` when chaining on the map is needed; use `put` when the stored value
should flow directly into the next expression.


## plain-tag

Transform a generic tagged template function into a plain string by
interpolating the static parts and values, without any special handling or
escaping.

```js
import plainTag from '@webreflection/utils/plain-tag';

console.log(plainTag`Hello, ${'world'}!`);
// Hello, world!
```


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


## set

A native `Set` subclass with one extra method: `put(value)`. It stores the entry
like `add`, but returns the value instead of the set reference itself.

```js
import Set from '@webreflection/utils/set';

const set = new Set;

const value = set.put('ready');

console.log(value);
// 'ready'
```

Use `add` when chaining on the set is needed; use `put` when the stored value
should flow directly into the next expression.


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


## weakmap

A native `WeakMap` subclass with one extra method: `put(key, value)`. It stores
the entry like `set`, but returns the value instead of the map reference itself.

```js
import WeakMap from '@webreflection/utils/weakmap';

const map = new WeakMap;
const key = {};

const value = map.put(key, { ready: true });

console.log(value.ready);
// true
```

Use `set` when chaining on the map is needed; use `put` when the stored value
should flow directly into the next expression. Keys must be objects or symbols,
like the native `WeakMap`.


## weakset

A native `WeakSet` subclass with one extra method: `put(value)`. It stores the
entry like `add`, but returns the value instead of the set reference itself.

```js
import WeakSet from '@webreflection/utils/weakset';

const set = new WeakSet;
const item = {};

const value = set.put(item);

console.log(value === item);
// true
```

Use `add` when chaining on the set is needed; use `put` when the stored value
should flow directly into the next expression. Values must be objects or
symbols, like the native `WeakSet`.


## with-resolvers

This utility returns a self-bound `Promise.withResolvers()` implementation that also works on older Android WebView runtimes.

```js
import withResolvers from '@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();

setTimeout(resolve, 0, 42);

export default promise;
```
