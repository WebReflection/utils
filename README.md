# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social media photo by [Benjamin Lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A curated, *TypeScript*-friendly [collection](./src/) of utilities:

  * **[all](./src/#all)** - `Promise.all` via object destructuring
  * **[ascii](./src#ascii)** - basic string-to-buffer conversion without validation
  * **[bound-once](./src#bound-once)** - retrieve unique bound methods per realm
  * **[bound](./src#bound)** - retrieve one-off bound methods
  * **[cache](./src#cache)** - temporal `Map` for same-tick or short-lived memoization; supports [Map `put`](#map-put-convention) and `getOrInsert` helpers
  * **[content](./src#content)** - build factories that parse markup strings into `DocumentFragment` instances within a chosen element context
  * **[dom-content](./src#dom-content)** - parse HTML or SVG markup strings into a `DocumentFragment` via ready-made `html` and `svg` helpers
  * **[empty](./src#empty)** - frozen shared empty references: array, object, or null-prototype object
  * **[has-own](./src#has-own)** - quick polyfill for `Object.hasOwn()` on older browsers
  * **[iterable](./src#iterable)** - make plain objects iterable as `Object.entries(object)` pairs, without touching objects that are already iterable
  * **[json-storage](./src#json-storage)** - JSON-aware, iterable, Map-like `localStorage` / `sessionStorage` facade with [Map `put`](#map-put-convention)
  * **[map](./src#map)** - native `Map` subclass with [Map `put`](#map-put-convention)
  * **[registry](./src#registry)** - validated `Map` with duplicate-key protection by default; inherits [Map `put`](#map-put-convention)
  * **[set](./src#set)** - native `Set` subclass with [Set `put`](#set-put-convention)
  * **[shared-array-buffer](./src#shared-array-buffer)** - simulate *SAB* when not available
  * **[sticky](./src#sticky)** - keep useful values stable once per realm
  * **[weakmap](./src#weakmap)** - native `WeakMap` subclass with [Map `put`](#map-put-convention)
  * **[weakset](./src#weakset)** - native `WeakSet` subclass with [Set `put`](#set-put-convention)
  * **[with-resolvers](./src#with-resolvers)** - use a self-bound `Promise.withResolvers()` helper for older runtimes


### Map `put` convention

Every utility that subclasses `Map` or `WeakMap` — **[map](./src#map)**, **[cache](./src#cache)**, **[registry](./src#registry)**, and **[weakmap](./src#weakmap)** — adds a `put(key, value)` method. It stores the entry like `set`, but returns the stored value instead of the map reference.

That replaces the awkward get-or-insert dance where `set` returns the map, not the value, and the initializer cannot be deferred:

```js
// before: value is always computed; set returns the map, not the value
const value = map.get(key) || (map.set(key, expensive()), map.get(key));

// after: expensive() runs only when the key is absent
const value = map.get(key) ?? map.put(key, expensive());
```

Use `set` when map chaining is needed; use `put` when the stored value should flow into the next expression.

**[json-storage](./src#json-storage)** is not a `Map` subclass, but its Map-like API follows the same `put` contract.


### Set `put` convention

Every utility that subclasses `Set` or `WeakSet` — **[set](./src#set)** and **[weakset](./src#weakset)** — adds a `put(value)` method. It stores the entry like `add`, but returns the value instead of the set reference.

That replaces the awkward membership dance where `add` returns the set, not the value, and a separate reference is needed to keep using the entry:

```js
// before: add returns the set, not the value
const value = expensive();
set.has(value) || set.add(value);

// after: expensive() runs only when the value is absent
const value = set.has(item) ? item : set.put(expensive());
```

Use `add` when set chaining is needed; use `put` when the stored value should flow into the next expression.


MIT-style license.
