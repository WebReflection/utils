import fetch from '../src/fetch.js';

console.log(await fetch(location.href).then(r => r.ok));
console.log(await fetch(location.href).ok);
console.log(await fetch(location.href).text);
console.log(await fetch(location.href).arrayBuffer);
console.log(await fetch('shenanigans').text);
