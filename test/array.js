import { isSparse, map, mapObject } from '../src/array.js';

const test = [{ a: 1, b: 2 }, { a: 3, b: 4 }];

console.assert(map(test).a.join(',') === '1,3');
console.assert(JSON.stringify(mapObject(test).a) === '[{"a":1},{"a":3}]');
console.assert(JSON.stringify(mapObject(test)['a,b']) === '[{"a":1,"b":2},{"a":3,"b":4}]');
console.assert(JSON.stringify(mapObject(test)[['a', 'b']]) === '[{"a":1,"b":2},{"a":3,"b":4}]');

const mark = Symbol('mark');
test[mark] = true;
console.assert(map(test)[mark] === true);
console.assert(mapObject(test)[mark] === true);

let thisArg;
const dispose = Symbol('dispose');
test[dispose] = function () { thisArg = this; };
map(test)[dispose]();
console.assert(thisArg === test);
mapObject(test)[dispose]();
console.assert(thisArg === test);

console.assert([...map(test)][0] === test[0]);
console.assert([...mapObject(test)][1] === test[1]);
console.assert(typeof map(test)[Symbol.iterator] === 'function');
console.assert(typeof mapObject(test)[Symbol.iterator] === 'function');

console.assert(!isSparse([]));
console.assert(!isSparse([undefined]));
console.assert(isSparse(Array(1)));
