import Cache from '../src/cache.js';

let cache = new Cache;

console.assert(cache.size === 0, 'cache.size === 0');
cache.getOrInsert('foo', 'bar');
console.assert(cache.get('foo') === 'bar', 'cache.get("foo") === "bar"');
cache.getOrInsert('foo', 'baz');
console.assert(cache.get('foo') === 'bar', 'cache.get("foo") === "bar"');
cache.delete('foo');;
console.assert(cache.getOrInsertComputed('foo', () => 'baz') === 'baz', 'cache.getOrInsertComputed("foo", () => "baz") === "baz"');

setTimeout(() => {
  cache = new Cache(10);
  console.assert(cache.size === 0, 'cache.size === 0');
  console.assert(cache.get('foo') ?? cache.put('foo', 'bar') === 'bar', 'cache.get("foo") ?? cache.put("foo", "bar") === "bar"');
  console.assert(cache.size === 1, 'cache.size === 1');
  setTimeout(() => {
    console.assert(cache.size === 0, 'cache.size === 0');
    cache.set('foo', 'bar');
    console.assert(cache.size === 1, 'cache.size === 1');
    cache.set('foo', 'baz');
    console.assert(cache.size === 1, 'cache.size === 1');
    cache.clear();
    console.assert(cache.size === 0, 'cache.size === 0');
    console.assert(cache.getOrInsertComputed('foo', String) === 'foo', 'cache.getOrInsertComputed("foo", String) === "foo"');
    console.assert(cache.getOrInsertComputed('foo', () => 'baz') === 'foo', 'cache.getOrInsertComputed("foo", () => "baz") === "foo"');
  }, 20);
}, 100);
