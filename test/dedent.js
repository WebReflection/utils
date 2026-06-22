import dedent from '../src/dedent.js';

console.assert(dedent`
  Hello,
  world!
` === `
Hello,
world!
`);

console.assert(dedent(`
  Hello,
  world!
`) === `
Hello,
world!
`);
