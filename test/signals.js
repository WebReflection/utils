import { Signal, dispose, signal, computed, batch, effect } from '../src/signals/index.js';

const assert = (actual, expected, message) => {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected} but got ${actual}`);
  }
};

let calls = 0, effects = 0;
let a = signal(1);
let b = signal(2);
let c = computed(() => { calls++; return a.value + b.value; }, [a, b]);

assert(c.value, 3, 'c.value === 3');
assert(calls, 1, 'calls === 1');

a.value = 3;
assert(c.value, 5, 'c.value === 5');
assert(calls, 2, 'calls === 2');

batch(() => {
  a.value = 4;
  batch(() => {
    b.value = 5;
  });
});

assert(c.value, 9, 'c.value === 9');
assert(calls, 3, 'calls === 3');

// same-value write: Object.is skip — no notify, computed does not re-run
a.value = 4;
assert(calls, 3, 'same-value write does not recompute');
assert(c.value, 9, 'c.value unchanged after same-value write');

let cleanups = 0;
let lastCleanupAt = -1;
let stop = effect(() => {
  effects++;
  const seen = c.value;
  return () => {
    cleanups++;
    lastCleanupAt = seen;
  };
}, [c]);

assert(effects, 1, 'effects === 1');
assert(cleanups, 0, 'cleanups === 0');

a.value = 5;
assert(effects, 2, 'effects === 2');
assert(cleanups, 1, 'cleanups === 1 after re-run');
assert(lastCleanupAt, 9, 'previous effect cleaned with prior value');

batch(() => {
  assert(c.value, 10, 'c.value === 10');
  assert(calls, 4, 'calls === 4');
  a.value = 6;
});

assert(effects, 3, 'effects === 3');
assert(cleanups, 2, 'cleanups === 2 after batch');
assert(c.value, 11, 'c.value === 11');
assert(calls, 5, 'calls === 5');
assert(lastCleanupAt, 10, 'batch re-run cleaned prior effect');

stop();
assert(cleanups, 3, 'cleanups === 3 after stop');
assert(lastCleanupAt, 11, 'stop cleaned last effect');

c[dispose]();

a.value = 5;

assert(effects, 3, 'effects === 3');
assert(cleanups, 3, 'cleanups === 3');
assert(c.value, 11, 'c.value === 11');
assert(calls, 5, 'calls === 5');

a[dispose]();
b[dispose]();

// Object.is edge cases + eager escape hatch
let notifies = 0;
const n = signal(NaN);
n.add(() => { notifies++; });
n.value = NaN;
assert(notifies, 0, 'NaN to NaN does not notify');
n.value = 0;
assert(notifies, 1, 'NaN to 0 notifies');
n.value = -0;
assert(notifies, 2, '0 to -0 notifies (not Object.is-equal)');
n.value = -0;
assert(notifies, 2, '-0 to -0 does not notify');

notifies = 0;
const eager = new Signal(1, true);
eager.add(() => { notifies++; });
eager.value = 1;
assert(notifies, 1, 'eager signal notifies on same-value write');
eager.value = 1;
assert(notifies, 2, 'eager signal notifies on every write');

// computed re-runs only when a source notifies; still notifies its own
// subscribers when the derived result is unchanged
let derivedCalls = 0;
let derivedNotifies = 0;
const x = signal(1);
const y = signal(10);
const flag = computed(() => {
  derivedCalls++;
  return x.value > 0 ? 1 : 0;
}, [x, y]);
flag.add(() => { derivedNotifies++; });

assert(flag.value, 1, 'flag.value === 1');
assert(derivedCalls, 1, 'derivedCalls === 1');

x.value = 1;
assert(derivedCalls, 1, 'same-value source does not recompute derived');
assert(derivedNotifies, 0, 'same-value source does not notify derived subscribers');

x.value = 2;
assert(flag.value, 1, 'derived result unchanged');
assert(derivedCalls, 2, 'changed source recomputes derived');
assert(derivedNotifies, 1, 'derived notifies even when result is unchanged');

y.value = 10;
assert(derivedCalls, 2, 'same-value unused-looking source still gated by Object.is');
y.value = 11;
assert(derivedCalls, 3, 'any listed source notify recomputes derived');
assert(derivedNotifies, 2, 'derived notifies again when another source changes');
