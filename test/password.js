import password, { VersionError } from '../src/password.js';

const assert = (condition, message = 'Assertion failed') => {
  if (!condition)
    throw new Error(message);
};

console.time('password');

const { encrypt, decrypt } = password('1234567890');
const source = 'Hello 🌍 !';

const encrypted = await encrypt(source);
const encryptedAgain = await encrypt(source);
assert(encrypted !== encryptedAgain, 'equal plaintext uses separate envelopes');
assert(await decrypt(encrypted) === source, 'string round trip');

const encoded = new TextEncoder().encode(source);
assert(await decrypt(await encrypt(encoded)) === source, 'typed-array round trip');
assert(await decrypt(await encrypt(encoded.buffer)) === source, 'ArrayBuffer round trip');

const view = new Uint8Array(await encrypt(source, { buffer: true }));
assert(await decrypt(view) === source, 'ArrayBufferView round trip');

const decoded = new Uint8Array(await decrypt(view, { buffer: true }));
assert(decoded.every((byte, i) => encoded[i] === byte) && decoded.length === encoded.length, 'binary round trip');

const compressed = await encrypt(source, { format: 'deflate' });
assert(await decrypt(compressed, { format: 'deflate' }) === source, 'compressed round trip');

let invalidPasswordRejected = false;
try {
  password('');
}
catch (error) {
  invalidPasswordRejected = error instanceof TypeError;
}
assert(invalidPasswordRejected, 'empty string password is rejected');

invalidPasswordRejected = false;
try {
  password(new Uint8Array);
}
catch (error) {
  invalidPasswordRejected = error instanceof TypeError;
}
assert(invalidPasswordRejected, 'empty binary password is rejected');

let invalidPepperRejected = false;
try {
  password('password', { pepper: '' });
}
catch (error) {
  invalidPepperRejected = error instanceof TypeError;
}
assert(invalidPepperRejected, 'empty string pepper is rejected');

invalidPepperRejected = false;
try {
  password('password', { pepper: new Uint8Array });
}
catch (error) {
  invalidPepperRejected = error instanceof TypeError;
}
assert(invalidPepperRejected, 'empty binary pepper is rejected');

let invalidIterationsRejected = false;
try {
  password(source, { iterations: 0 });
}
catch (error) {
  invalidIterationsRejected = error instanceof RangeError;
}
assert(invalidIterationsRejected, 'zero iterations are rejected');

invalidIterationsRejected = false;
try {
  password(source, { iterations: 1.5 });
}
catch (error) {
  invalidIterationsRejected = error instanceof RangeError;
}
assert(invalidIterationsRejected, 'non-integer iterations are rejected');

let invalidSHARejected = false;
try {
  password(source, { SHA: 224 });
}
catch (error) {
  invalidSHARejected = error instanceof RangeError;
}
assert(invalidSHARejected, 'unsupported SHA is rejected');

const sha384 = password(source, { SHA: 384, iterations: 1 });
assert(await sha384.decrypt(await sha384.encrypt(source)) === source, 'SHA-384 round trip');

const sha512 = password(source, { SHA: 512, iterations: 1 });
assert(await sha512.decrypt(await sha512.encrypt(source)) === source, 'SHA-512 round trip');

const emptyStringPepper = (() => {
  try {
    password('password', { pepper: '' });
  }
  catch (error) {
    return error instanceof TypeError;
  }
  return false;
})();
assert(emptyStringPepper, 'empty string pepper is rejected');

const emptyBinaryPepper = (() => {
  try {
    password('password', { pepper: new Uint8Array });
  }
  catch (error) {
    return error instanceof TypeError;
  }
  return false;
})();
assert(emptyBinaryPepper, 'empty binary pepper is rejected');

const emptyPassword = (() => {
  try {
    password('');
  }
  catch (error) {
    return error instanceof TypeError;
  }
  return false;
})();
assert(emptyPassword, 'empty password is rejected');

const stringPepper = password('password', { pepper: 'server-secret' });
const stringPepperEncrypted = await stringPepper.encrypt(source);
assert(await stringPepper.decrypt(stringPepperEncrypted) === source, 'string pepper round trip');

const bufferPassword = password(new TextEncoder().encode('password').buffer, {
  pepper: new TextEncoder().encode('server-secret').buffer
});
const bufferPepperEncrypted = await bufferPassword.encrypt(source);
assert(await bufferPassword.decrypt(bufferPepperEncrypted) === source, 'ArrayBuffer password and pepper round trip');

const binaryPassword = password(new TextEncoder().encode('password'), {
  pepper: new TextEncoder().encode('server-secret')
});
const binaryPepperEncrypted = await binaryPassword.encrypt(source);
assert(await binaryPassword.decrypt(binaryPepperEncrypted) === source, 'binary password and pepper round trip');

let wrongPepperRejected = false;
try {
  await password('password', { pepper: 'wrong-secret' }).decrypt(stringPepperEncrypted);
}
catch (error) {
  wrongPepperRejected = error instanceof Error;
}
assert(wrongPepperRejected, 'wrong pepper is rejected');

const versionOne = password('password', { pepper: 'server-secret', version: 1 });
const versionOneEnvelope = await versionOne.encrypt(source);
let versionMismatch;
try {
  await password('password', { pepper: 'server-secret', version: 2 }).decrypt(versionOneEnvelope);
}
catch (error) {
  versionMismatch = error;
}
assert(versionMismatch instanceof VersionError, 'version mismatch throws VersionError');
assert(versionMismatch.expected === 2, 'VersionError exposes expected version');
assert(versionMismatch.received === 1, 'VersionError exposes received version');

const versionRoundTrip = await password('password', {
  pepper: 'server-secret',
  version: 0xffffffff
}).decrypt(await password('password', {
  pepper: 'server-secret',
  version: 0xffffffff
}).encrypt(source));
assert(versionRoundTrip === source, 'uint32 version round trip');

let invalidVersionRejected = false;
try {
  password(source, { version: -1 });
}
catch (error) {
  invalidVersionRejected = error instanceof RangeError;
}
assert(invalidVersionRejected, 'negative version is rejected');

invalidVersionRejected = false;
try {
  password(source, { version: 0x100000000 });
}
catch (error) {
  invalidVersionRejected = error instanceof RangeError;
}
assert(invalidVersionRejected, 'version above uint32 is rejected');

let wrongPasswordRejected = false;
try {
  await password('wrong password').decrypt(encrypted);
}
catch (error) {
  wrongPasswordRejected = error instanceof Error;
}
assert(wrongPasswordRejected, 'wrong password is rejected');

const alphabetEncrypted = await encrypt(source, { alphabet: 'base64url' });
assert(await decrypt(alphabetEncrypted, { alphabet: 'base64url' }) === source, 'base64url round trip');

const alphabetRawOutput = await encrypt(source, { buffer: true, alphabet: 'base64url' });
assert(typeof alphabetRawOutput === 'string', 'alphabet output remains base64url string');

const tampered = Uint8Array.fromBase64(encrypted);
tampered[tampered.length - 1] ^= 1;
let tamperingRejected = false;
try {
  await decrypt(tampered.toBase64());
}
catch (error) {
  tamperingRejected = error instanceof Error;
}
assert(tamperingRejected, 'tampered ciphertext is rejected');

let truncatedRejected = false;
try {
  await decrypt('');
}
catch (error) {
  truncatedRejected = error instanceof Error;
}
assert(truncatedRejected, 'truncated ciphertext is rejected');

console.timeEnd('password');
