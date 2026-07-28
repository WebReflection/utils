import { signal, subscribe, unsubscribe } from '../src/ref-signals.js';

const num = signal(0);
const subscriber = () => {
  calls++;
  ref.value = num.value;
};

let ref = { value: 0 }, other = {}, calls = 0;

subscribe(ref, num, subscriber);
subscribe(other, num, subscriber);

console.assert(ref.value === 0, 'value === 0');
console.assert(calls === 0, 'calls === 0');

num.value = 1;

console.assert(ref.value === 1, 'value === 1');
console.assert(calls === 1, 'calls === 1');

unsubscribe(ref, num, subscriber);

num.value = 2;

console.assert(ref.value === 1, 'value === 1');
console.assert(calls === 1, 'calls === 1');

ref = null;
other = null;

gc();
setTimeout(gc, 100);
