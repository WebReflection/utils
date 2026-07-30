import { Computed, Signal, signal, computed, create, update, raw } from '../src/state-signals.js';

// explicit signal
const count = signal(0);

// subscribes only to the count signal
const comp = computed(() => `reactive ${count.value}`, [count]);

const state = create({
  // explicit signal
  count,

  // explicit computed
  comp,

  // implicit signal
  name: 'John',

  // implicit computed (subscribes to all signals in the state)
  get whole() {
    return `${this.name} is ${this.count} years old`;
  },

  // accessors with both set and get are left as-is
});

const assert = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
};

assert(state.whole, 'John is 0 years old');
assert(raw(state, 'count') instanceof Signal, true);
assert(raw(state, 'name') instanceof Signal, true);
assert(raw(state, 'whole') instanceof Computed, true);
assert(raw(state, 'comp') instanceof Computed, true);
assert(state.count, 0);
assert(state.name, 'John');
assert(state.whole, 'John is 0 years old');
assert(state.comp, 'reactive 0');

update(state, { count: 1, name: 'Jane' });
assert(state.count, 1);
assert(state.name, 'Jane');
assert(state.whole, 'Jane is 1 years old');
assert(state.comp, 'reactive 1');
