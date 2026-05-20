import assert from 'node:assert/strict';
import Registry from '../src/registry.js';

const registry = new Registry;

registry.set('foo', 'bar');
assert.equal(registry.get('foo'), 'bar');
assert.equal(registry.delete('missing'), false);

assert.throws(
  () => registry.delete('foo'),
  {
    name: 'TypeError',
    message: 'Unable to remove key: foo'
  }
);

assert.equal(registry.get('foo'), 'bar');

assert.throws(
  () => registry.set('foo', 'baz'),
  {
    name: 'TypeError',
    message: 'Duplicate key: foo'
  }
);

const strings = new Registry(
  [
    ['foo', 'bar'],
    ['bar', 'baz']
  ],
  {
    key: value => typeof value === 'string',
    value: value => typeof value === 'string'
  }
);

assert.equal(strings.get('foo'), 'bar');
assert.equal(strings.get('bar'), 'baz');

assert.throws(
  () => strings.set(1, 'one'),
  {
    name: 'TypeError',
    message: 'Invalid key: 1'
  }
);

assert.throws(
  () => strings.set('one', 1),
  {
    name: 'TypeError',
    message: 'Invalid value: 1'
  }
);

assert.throws(
  () => new Registry(
    [
      ['foo', 'bar'],
      ['foo', 'baz']
    ],
    { key: value => typeof value === 'string' }
  ),
  {
    name: 'TypeError',
    message: 'Duplicate key: foo'
  }
);

const duplicates = new Registry(
  [
    ['foo', 'bar'],
    ['foo', 'baz']
  ],
  {
    key: value => value === 'foo',
    value: value => typeof value === 'string',
    unique: false
  }
);

assert.equal(duplicates.get('foo'), 'baz');
assert.equal(duplicates.set('foo', 'qux'), duplicates);
assert.equal(duplicates.get('foo'), 'qux');
assert.equal(duplicates.delete('foo'), true);
assert.equal(duplicates.has('foo'), false);
duplicates.set('foo', 'again');
assert.equal(duplicates.get('foo'), 'again');

assert.throws(
  () => new Registry(
    [[1, 'one']],
    {
      key: value => typeof value === 'string',
      unique: false
    }
  ),
  {
    name: 'TypeError',
    message: 'Invalid key: 1'
  }
);

const booleans = new Registry(null, {
  value: value => typeof value === 'boolean'
});

booleans.set('enabled', true);
assert.equal(booleans.get('enabled'), true);

console.log('Registry tests passed');