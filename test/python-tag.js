import pythonTag from '../src/python-tag.js';

const py = await pythonTag();

let globals, result = await py`
  async def main():
    print('Hello, async world!')

  await main()

  'test' in globals()
`;

console.assert(result === false, 'test is not in globals');

globals = py.interpreter.toPy({ test: true });

result = py({ globals })`
  async def main():
    print('Hello, async world!')

  await main()

  'test' in globals() and globals()['test'] == True
`;

console.assert(result instanceof Promise, 'result is a Promise');
console.assert((await result) === true, 'test is in globals');

result = await py(`
  async def main():
    print('Hello, async world!')

  await main()

  'test' in globals()
`);

console.assert(result === false, 'test is not in globals');

result = await py(`
  async def main():
    print('Hello, async world!')

  await main()

  'test' in globals() and globals()['test'] == True
`, { globals });

console.assert(result === true, 'test is in globals');

result = py({ sync: true })`
  print('Hello, world!')

  'test' in globals()
`;

console.assert(result === false, 'test is not in globals');

const mpy = await pythonTag('https://esm.run/@micropython/micropython-webassembly-pyscript');

await mpy`
  async def main():
    print('Hello, async MicroPython!')
    return 42

  await main()
`;

mpy({ sync: true })`
  print('Hello, sync MicroPython!')
`;
