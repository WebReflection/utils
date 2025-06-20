# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social Media Photo by [benjamin lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A [collection](./src/) of utility functions.

```js
// example: a shim based on ArrayBuffer if native is `false`
import { SharedArrayBuffer, native } from 'https://esm.run/@webreflection/utils/shared-array-buffer';

// example: self bound Promise.withResolvers()
import withResolvers from 'https://esm.run/@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();
```
