import assert from 'node:assert/strict';
import { decode, encode, stream, Transformer } from '../src/base64.js';

const value = 'Hello, world!';

const encoded = await encode(value);
const decoded = await decode(encoded);

assert.equal(decoded, value);

const compressed = await encode(value, { format: 'deflate' });
const decompressed = await decode(compressed, { format: 'deflate' });

assert.equal(decompressed, value);
assert.equal(await (await stream(compressed, { format: 'deflate' })).text(), value);
assert.equal(await (await stream(await encode(value))).text(), value);


const { body } = await fetch(`data:application/octet-stream,${encoded}`);
const response = new Response(body.pipeThrough(new Transformer));
assert.equal(await response.text(), value);

const chunked = (str, size) => {
  const bytes = new TextEncoder().encode(str);
  return new ReadableStream({
    start(controller) {
      for (let i = 0; i < bytes.length; i += size) controller.enqueue(bytes.subarray(i, i + size));
      controller.close();
    }
  });
};

// base64 stream chunked at 3 bytes, misaligned with 4-chars groups
assert.equal(await new Response(chunked(encoded, 3).pipeThrough(new Transformer)).text(), value);

// unpadded base64 stream chunked at 3 bytes, partial group decoded at flush
assert.equal(await new Response(chunked(encoded.replace(/=+$/, ''), 3).pipeThrough(new Transformer)).text(), value);

const buffer = await decode(compressed, { format: 'deflate', buffer: true });

assert.ok(buffer instanceof ArrayBuffer);
assert.deepEqual(new Uint8Array(buffer), new TextEncoder().encode(value));



import { readFileSync } from 'fs';
const file = readFileSync('README.md').toString('utf-8');

assert.ok((await encode(file, { format: 'deflate' })).length < file.length);
