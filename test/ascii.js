import assert from 'node:assert/strict';
import { encode, decode } from '../src/ascii.js';

assert.deepEqual(encode('Hello, world!'), new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33]));
assert.equal(decode(new Uint8Array([72, 101, 108, 108, 111, 44, 32, 119, 111, 114, 108, 100, 33])), 'Hello, world!');
