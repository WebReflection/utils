import assert from 'node:assert/strict';
import { decode, encode } from '../src/base64.js';

const value = 'Hello, world!';

const encoded = await encode(value);
const decoded = await decode(encoded);

assert.equal(decoded, value);

const compressed = await encode(value, { format: 'deflate' });
const decompressed = await decode(compressed, { format: 'deflate' });

assert.equal(decompressed, value);

const buffer = await decode(compressed, { format: 'deflate', buffer: true });

assert.ok(buffer instanceof ArrayBuffer);
assert.deepEqual(new Uint8Array(buffer), new TextEncoder().encode(value));
