# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social media photo by [Benjamin Lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A curated, *TypeScript*-friendly [collection](./src/) of utilities:

  * **[all](./src/#all)** - `Promise.all` via object destructuring
  * **[ascii](./src#ascii)** - basic string-to-buffer conversion without validation
  * **[bound-once](./src#bound-once)** - retrieve unique bound methods per realm
  * **[bound](./src#bound)** - retrieve one-off bound methods
  * **[iterable](./src#iterable)** - make plain objects iterable as `Object.entries(object)` pairs, without touching objects that are already iterable
  * **[json-storage](./src#json-storage)** - use `localStorage` or `sessionStorage` through a JSON-aware, iterable, *Map*-friendly API
  * **[registry](./src#registry)** - use a `Map`-like API with key/value validation and duplicate-key protection by default
  * **[shared-array-buffer](./src#shared-array-buffer)** - simulate *SAB* when not available
  * **[sticky](./src#sticky)** - keep useful values stable once per realm
  * **[with-resolvers](./src#with-resolvers)** - use a self-bound `Promise.withResolvers()` helper for older runtimes

MIT-style license.
