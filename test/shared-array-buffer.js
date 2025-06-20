const { SharedArrayBuffer: SAB } = globalThis;

globalThis.SharedArrayBuffer = null;

const { SharedArrayBuffer, native } = await import("../src/shared-array-buffer.js");

globalThis.SharedArrayBuffer = SAB;

console.assert(!native);

const gsab = new SharedArrayBuffer(4, { maxByteLength: 8 });

console.assert(gsab.byteLength === 4);
console.assert(gsab.growable);

gsab.grow(8);

console.assert(gsab.byteLength === 8);

const fsab = new SharedArrayBuffer(6);
console.assert(fsab.byteLength === 6);
console.assert(!fsab.growable);
