import { split } from '../src/string.js';

const includes = (content, word, re) => {
  for (const line of split(content, re)) {
    if (line === word) return true;
  }
  return false;
}

console.assert(includes('a\r\nb\nc\r\nd', 'a'));
console.assert(includes('a\r\nb\nc\r\nd', 'b'));
console.assert(includes('a\r\nb\nc\r\nd', 'c'));
console.assert(includes('a\r\nb\nc\r\nd', 'd'));
console.assert(!includes('a\r\nb\nc\r\nd', 'e'));

console.assert(includes('a\r\nb\nc\r\nd', 'a', /\r\n/g), 'a');
console.assert(!includes('a\r\nb\nc\r\nd', 'b', /\r\n/g), 'b');
console.assert(includes('a\r\nb\nc\r\nd', 'b\nc', /\r\n/g), 'b\nc');
