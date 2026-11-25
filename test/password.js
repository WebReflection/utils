import password from '../src/password.js';

console.time('password');
const { encrypt, decrypt } = password('1234567890');

const source = 'Hello 🌍 !';

const encrypted = await encrypt(source);
const decrypted = await decrypt(encrypted);
// console.log({ source, encrypted, decrypted });
console.assert(decrypted === source, 'decrypted === source');

const encoded = new TextEncoder().encode(source);

console.assert(await encrypt(encoded) === encrypted);
console.assert(await encrypt(encoded.buffer) === encrypted);

const view = new Uint8Array(await encrypt(source, { buffer: true }));

console.assert(String.fromCharCode(...view) !== encrypted);
console.assert(await decrypt(view) === source);

const decoded = new Uint8Array(await decrypt(view, { buffer: true }));
console.assert(decoded.every((c, i) => encoded[i] === c) && decoded.length === encoded.length);

const compressed = await encrypt(source, { format: 'deflate' });
console.assert(compressed !== encrypted);
console.assert(await decrypt(compressed, { format: 'deflate' }) === source);

console.timeEnd('password');
