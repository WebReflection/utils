# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social Media Photo by [benjamin lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A curated, *TypeScript* friendly, [collection](./src/) of utilities:

  * **[all](https://github.com/WebReflection/utils/tree/main/src#all)** - `Promise.all` via object destructuring
  * **[ascii](https://github.com/WebReflection/utils/tree/main/src#ascii)** - basic string to buffer conversion (without validation)
  * **[bound-once](https://github.com/WebReflection/utils/tree/main/src#bound-once)** - to retrieve unique bound methods per realm
  * **[bound](https://github.com/WebReflection/utils/tree/main/src#bound)** - to retrieve one-off bound methods
  * **[iterable](https://github.com/WebReflection/utils/tree/main/src#iterable)** - to make plain objects iterable as `Object.entries(object)` pairs, without touching objects that already are iterable
  * **[json-storage](https://github.com/WebReflection/utils/tree/main/src#json-storage)** - to use `localStorage` or `sessionStorage` through a JSON-aware, iterable, *Map* friendly API
  * **[shared-array-buffer](https://github.com/WebReflection/utils/tree/main/src#shared-array-buffer)** - to simulate *SAB* when not available
  * **[sticky](https://github.com/WebReflection/utils/tree/main/src#sticky)** - to stick once per realm anything useful
  * **[with-resolvers](https://github.com/WebReflection/utils/tree/main/src#with-resolvers)** - a self bound `Promise.withResolver()` for older runtimes

MIT style License.
