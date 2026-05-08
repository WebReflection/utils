# @webreflection/utils

[![Coverage Status](https://coveralls.io/repos/github/WebReflection/utils/badge.svg?branch=main)](https://coveralls.io/github/WebReflection/utils?branch=main)

<sup>**Social Media Photo by [benjamin lehman](https://unsplash.com/@abject) on [Unsplash](https://unsplash.com/)**</sup>


A [collection](./src/) of utility functions.

```js
// example: a shim based on ArrayBuffer if native is `false`
import { SharedArrayBuffer, native } from '@webreflection/utils/shared-array-buffer';

// example: self bound Promise.withResolvers()
import withResolvers from '@webreflection/utils/with-resolvers';

const { promise, resolve, reject } = withResolvers();

// example: any object bound method
import bound from '@webreflection/utils/bound';

const { all, resolve } = bound(Promise);
all([1, 2, 3]);
resolve(4);


// example: any object bound method is identical
//          particularly useful for listeners identity
import boundOnce from '@webreflection/utils/bound-once';

const { all, resolve } = boundOnce(Promise);
all([1, 2, 3]);
resolve(4);

boundOnce(Promise).all === all;
boundOnce(Promise).resolve === resolve;

// example: always retrieve the first time data/module
import sticky from '@webreflection/utils/sticky';

const [module, known] = sticky('@module/name', { always: 'same' });

export default module;
```
