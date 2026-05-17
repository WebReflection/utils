const { entries, keys, values } = Object;

class Storage extends Map {
  getItem(key) {
    return super.get(key);
  }
  setItem(key, value) {
    super.set(key, value);
  }
  removeItem(key) {
    super.delete(key);
  }
}

const { default: JSONStorage } = await import('../src/json-storage.js');

function test(type) {
  // setup - if flag is not passed to store data
  const global = type === JSONStorage.LOCAL ? 'localStorage' : 'sessionStorage';
  const unknown = !globalThis[global];
  if (unknown) {
    Object.keys = target => target.keys();
    Object.values = target => target.values();
    Object.entries = target => target.entries();
    globalThis[global] = new Storage;
  }

  // test
  const storage = new JSONStorage(type);
  storage.clear();
  console.assert(storage.get('foo') === void 0, 'storage.get("foo") === void 0');
  console.assert(storage.getOrInsert('foo', 'bar') === 'bar', 'storage.getOrInsert("foo", "bar") === "bar"');
  console.assert(storage.getOrInsert('foo', 'baz') === 'bar', 'storage.getOrInsert("foo", "baz") === "bar"');
  console.assert(storage.getOrInsertComputed('foo', () => 'baz') === 'bar', 'storage.getOrInsertComputed("foo", () => "baz") === "bar"');
  console.assert(storage.has('foo'), 'storage.has("foo")');
  console.assert(storage.delete('foo'), 'storage.delete("foo")');
  console.assert(!storage.has('foo'), 'storage.has("foo")');
  console.assert(storage.getOrInsertComputed('foo', () => 'baz') === 'baz', 'storage.getOrInsertComputed("foo", () => "baz") === "baz"');
  console.assert([...storage].join(',') === 'foo,baz', '[...storage].join(",") === "foo,baz"');
  console.assert([...storage.entries()].join(',') === 'foo,baz', '[...storage.entries()].join(",") === "foo,baz"');
  console.assert([...storage.keys()].join(',') === 'foo', '[...storage.keys()].join(",") === "foo"');
  console.assert([...storage.values()].join(',') === 'baz', '[...storage.values()].join(",") === "baz"');
  storage.clear();
  console.assert([...storage].length === 0, '[...storage].length === 0');

  // teardown - if flag is not passed to store data
  if (unknown) {
    delete globalThis[global];
    Object.keys = keys;
    Object.values = values;
    Object.entries = entries;
  }
}

test(JSONStorage.LOCAL);
test(JSONStorage.SESSION);

console.log('JSON Storage tests passed');
