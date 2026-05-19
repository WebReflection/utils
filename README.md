# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social media photo by [Benjamin Lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A curated, *TypeScript*-friendly [collection](./src/) of utilities:

  * **[all](https://github.com/WebReflection/utils/tree/main/src#all)** - `Promise.all` via object destructuring
  * **[ascii](https://github.com/WebReflection/utils/tree/main/src#ascii)** - basic string-to-buffer conversion without validation
  * **[bound-once](https://github.com/WebReflection/utils/tree/main/src#bound-once)** - retrieve unique bound methods per realm
  * **[bound](https://github.com/WebReflection/utils/tree/main/src#bound)** - retrieve one-off bound methods
  * **[iterable](https://github.com/WebReflection/utils/tree/main/src#iterable)** - make plain objects iterable as `Object.entries(object)` pairs, without touching objects that are already iterable
  * **[json-storage](https://github.com/WebReflection/utils/tree/main/src#json-storage)** - use `localStorage` or `sessionStorage` through a JSON-aware, iterable, *Map*-friendly API
  * **[registry](https://github.com/WebReflection/utils/tree/main/src#registry)** - use a `Map`-like API with key/value validation and duplicate-key protection by default
  * **[shared-array-buffer](https://github.com/WebReflection/utils/tree/main/src#shared-array-buffer)** - simulate *SAB* when not available
  * **[sticky](https://github.com/WebReflection/utils/tree/main/src#sticky)** - keep useful values stable once per realm
  * **[with-resolvers](https://github.com/WebReflection/utils/tree/main/src#with-resolvers)** - use a self-bound `Promise.withResolvers()` helper for older runtimes

MIT-style license.
