# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

A [collection](./src/) of utility functions.

```js
// example: self bound Promise.withResolvers()
import withResolvers from 'https://esm.run/@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();
```
