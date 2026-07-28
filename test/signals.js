import { dispose, signal, computed, batch, effect } from '../src/signals/index.js';

let calls = 0, effects = 0;
let a = signal(1);
let b = signal(2);
let c = computed(() => { calls++; return a.value + b.value; }, [a, b]);

console.assert(c.value === 3, 'c.value === 3');
console.assert(calls === 1, 'calls === 1');

a.value = 3;
console.assert(c.value === 5, 'c.value === 5');
console.assert(calls === 2, 'calls === 2');

batch(() => {
  a.value = 4;
  batch(() => {
    b.value = 5;
  });
});

console.assert(c.value === 9, 'c.value === 9');
console.assert(calls === 3, 'calls === 3');

let cleanup = effect(() => {
  effects++;
  console.assert('effect', c.value);
  return () => {
    console.assert(c.value === 11, 'c.value === 11');
    console.assert(calls === 5, 'calls === 5');
  };
}, [c]);

console.assert(effects === 1, 'effects === 1');
a.value = 5;
console.assert(effects === 2, 'effects === 2');

batch(() => {
  console.assert(c.value === 10, 'c.value === 10');
  console.assert(calls === 4, 'calls === 4');
  a.value = 6;
});

console.assert(effects === 3, 'effects === 3');
console.assert(c.value === 11, 'c.value === 11');
console.assert(calls === 5, 'calls === 5');

cleanup();
c[dispose]();

a.value = 5;

console.assert(effects === 3, 'effects === 3');
console.assert(c.value === 11, 'c.value === 11');
console.assert(calls === 5, 'calls === 5');

a[dispose]();
b[dispose]();
