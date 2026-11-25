# AGENTS.md

Guidance for AI agents (and humans) using or contributing to this repository.

`@webreflection/utils` is a curated collection of tiny, zero-dependency,
ESM-only JavaScript utilities. Source is plain JS with JSDoc; `types/` holds
generated TypeScript declarations. Consumers do not build or configure anything.

- Full documentation and examples: [`src/README.md`](./src/README.md)
- Authoritative export map: [`package.json`](./package.json) → `exports`
- Tests double as usage examples: [`test/`](./test)

**Before writing a helper, check this file.** These primitives exist to stop the
same patterns from being rewritten. Do not add a dependency for something that
is already here, and do not copy `src/` into a project: import the subpath.

## Consuming this package

- **Import subpaths, never the package root.** There is no `"."` export.
  ```js
  import accessor from '@webreflection/utils/accessor';
  import { html, svg } from '@webreflection/utils/dom-content';
  ```
- **Import only what you use.** Each utility is standalone, which also keeps
  bundles tiny. CDN equivalents:
  `https://esm.run/@webreflection/utils/<subpath>` or
  `https://cdn.jsdelivr.net/npm/@webreflection/utils/src/<file>.js`.
- **Many utilities have both a dashed and a slashed alias.** For example
  `dom-fragment` = `dom/fragment`, `json-storage` = `json/storage`,
  `weakmap` = `weak-map`, `state-signals` = `signals/state`. Not every alias
  exists (for example `base64/decode` has no dashed form), so check
  `package.json#exports` when unsure. Prefer the dashed name used in the docs.
- **Modules are side-effect free by default.** Exceptions: `dom-observer`
  (installs the shared observer and patches `attachShadow` on import),
  `dom-signals` (registers its subscriber on import), and `patch/*` (polyfills).
  The Python/WASM entries only bootstrap when called.
- **Consumers import package subpaths only.** Importing `src/...` directly is an
  internal pattern reserved for this repo's tests.
- **Modern runtimes only.** No transpilation, no polyfills, no CJS output.
- **Do not reimplement** a primitive that already exists here.

## Choose a utility

### Collections, identity, persistence

- **`map`** — native `Map` plus `put(key, value) => value`. Use `set` only when
  chaining on the map is needed. `import Map from '@webreflection/utils/map'`.
- **`set`** — native `Set` plus `put(value) => value`.
- **`weakmap`** / `weak-map` / `weak/map` — native `WeakMap` plus `put`; keys
  are objects or symbols.
- **`weakset`** / `weak-set` / `weak/set` — native `WeakSet` plus `put`.
- **`weak`** — `{ WeakMap, WeakSet }` when both are needed from one import.
- **`cache`** — `new Cache(delay = 0)`: a temporal `Map` for same-tick or
  short-lived memoization. The default cleans up in a microtask; a positive
  `delay` uses a timer. Has `put`, `getOrInsert`, `getOrInsertComputed`.
  Not a substitute for a long-term cache.
- **`registry`** — `new Registry(entries | null, { key, value, unique = true })`:
  validated `Map`. Invalid keys/values and duplicate keys throw `TypeError`.
  With default `unique: true`, `delete` and `clear` throw. Pass `unique: false`
  to behave like a mutable `Map`. Validators as type predicates drive TS types.
- **`json-storage`** / `json/storage` —
  `new JSONStorage(JSONStorage.LOCAL | JSONStorage.SESSION, json = JSON)`:
  Map-like `localStorage`/`sessionStorage` facade that parses/stringifies JSON.
  `set` returns the storage, `put` returns the value. If `stringify` yields
  `null`/`undefined`, the key is removed.
- **`empty`** — `{ array, object, nil }`, frozen shared empties; `nil` has a
  `null` prototype.
- **`id`** — `id(start = 0) => next()`; unique per factory, `int32`, wraps.
- **`ref-id`** / `ref/id` — `refId(objectOrSymbol) => int32`; weak and stable
  per reference, ids can be reused after GC.
- **`iterable`** — mutates a plain object to iterate `Object.entries`; returns
  already-iterable values unchanged.
- **`ref`** — aggregate `{ id, signals }`, mirroring `ref/id` and
  `ref/signals`.
- **`shared-array-buffer`** — exports `{ SharedArrayBuffer, native }`; when the
  platform lacks *SAB*, provides an `ArrayBuffer`-based shim with
  `grow(length)` / `growable`.
- **`bitwise`** — `bitwise(pad) => 1n << BigInt(pad)`, the BigInt mask helper.

### Functions, async, and control flow

- **`accessor`** — wrap `{ get(), set(value) }` as one function: `ref()` reads,
  `ref(value)` writes and returns the value. The returned function branches on
  its own argument count; for TS inference, declare `get()` with zero parameters
  and `set(value)` with one. `this` is the descriptor when called standalone, or
  the host when installed as a property.
- **`async-accessor`** / `accessor/async` — the same contract, always async:
  `await ref()` / `await ref(value)`.
- **`bound`** — `bound(object)` proxy whose methods are bound to `object`. Each
  access creates a new bound function.
- **`bound-once`** / `bound/once` — like `bound`, but each method returns the
  same bound function per realm. Use when identity matters (for example
  `removeEventListener`).
- **`bound-key`** / `bound/key` — `boundKey(...fns) => factories`; each
  `factory(key)` binds and caches a function for that key, ideal for DOM reuse.
- **`caller-of`** — `callerOf(fn) => (thisArg, ...args) => result`, i.e.
  `fn.call.bind(fn)` for borrowed natives.
- **`all`** — `Promise.all` companion: object literals resolve to same-key
  objects; arrays or multiple arguments resolve to arrays. Await a single
  promise directly.
- **`with-resolvers`** — self-bound `Promise.withResolvers()` fallback for older
  runtimes.
- **`next-resolver`** — `nextResolver(as?) => [next, resolve]`; `next()` gives a
  unique id plus its promise, `resolve(id, value)` or
  `resolve(id, null, error)` settles it later. Unknown/settled ids are no-ops.
- **`unthenable`** — `Proxy` wrapper that hides `then` from the get trap, so
  `await proxy === proxy` without consuming user traps.
- **`class`** — `class Sub extends custom(Base)`; `new Sub(existingTarget)` swaps
  the prototype instead of re-running `Base`. For illegal constructors
  (`Function`, DOM elements, boxed primitives).
- **`instance-of`** — `instanceOf(ref, constructors)` returns the first matching
  constructor for a non-null object, else `Array` for arrays or `Object`.
  Replaces `switch (true)`.
- **`has-own`** — `Object.hasOwn` with an old-engine fallback.
- **`sticky`** — `sticky(name, value, global?) => [value, known]`; first
  definition wins per realm via `Symbol.for(name)`. Use for module-level
  singletons across duplicate bundles. Never store secrets there.
- **`global`** — lazily trapped `globalThis`. Import before third-party code and
  read the properties you rely on early; only read properties are protected.
  Not a sandbox.
- **`fetch`** — `fetch` proxy exposing Response fields as thenables:
  `await fetch(url).status`, `await fetch(url).text`, while
  `await fetch(url)` is still a `Response`. Body/clone method access on
  `!response.ok` rejects with the `Response`. Captures `globalThis.fetch` at
  import time.

### Reactivity

All signal entries share `signal`, `Signal`, `computed`, `Computed`, `batch`,
`effect`, and `dispose`.

- **`signals`** — minimal explicit signals. Dependency lists are mandatory:
  `computed(fn, [a, b])`, `effect(fn, [a, b])`. Signals are non-eager by default
  (`Object.is` gate); use `new Signal(value, true)` when every write must
  notify. `Computed` exposes a readonly `.value`. `effect` runs immediately and
  may return a cleanup; its return value unsubscribes.
- **`state-signals`** / `signals/state` — adds `create(object)`, `update`,
  `raw`, `subscribe(state, key, cb)`, `unsubscribe`, `State`. Turns object data
  properties into signal-backed property accessors. Existing `Signal`/`Computed`
  values are reused; getter-only accessors become lazy `Computed`s; accessors
  with both `get` and `set` are left untouched.
- **`ref-signals`** / `ref/signals` / `signals/ref` — signals plus
  `subscribe(ref, signal, cb)` / `unsubscribe(ref, signal, cb)` keyed by any
  `WeakKey`; cleanup via `FinalizationRegistry`, no reconnect path.
- **`dom-signals`** / `signals/dom` — signals plus
  `subscribe(node, signal, cb)` / `unsubscribe(node, signal, cb)` keyed by DOM
  node. Detached subtrees drop callbacks; reinserted subtrees re-add and sync
  once. Requires a DOM and depends on `dom-observer`, so import it early.

### DOM

- **`dom-content`** / `dom/content` — ready-made `{ html, svg }` markup →
  `DocumentFragment` factories. Uses the global `document` at import time.
- **`content`** — `content({ name: contextElement }, document?)` builds custom
  markup factories for HTML, SVG, MathML, and SSR (pass a linkedom/jsdom
  `document` as the second argument).
- **`devtools`** — `$`, `$$`, `$x` with an optional root, mirroring DevTools.
- **`dom-fragment`** / `dom/fragment` — `new Fragment(documentFragment)` keeps a
  comment-bounded live range: `firstChild`/`lastChild`, `before`, `append`,
  `prepend`, `after`, `remove`, `replaceWith`, `valueOf()`. Designed as one
  `dom-diff` entry representing several nodes.
- **`dom-diff`** / `dom/diff` — `diff(current, future, pin?) => future`
  reconciles nodes/fragments immediately before a pin, preserving state via
  `moveBefore` when possible. Pass `pin` each call or `diff.bind(pin)` once.
- **`dom-observer`** / `dom/observer` — `{ subscribers, shadows }`: one shared
  document-wide `MutationObserver` plus an `attachShadow` patch, once per realm.
  Import as early as possible. Requires a DOM.
- **`dom-dataset-observer`** / `dom/dataset-observer` —
  `new DatasetObserver((target, name, oldValue, newValue) => {})` then
  `observe(target, { subtree })`; reports only `data-*` changes with camelCase
  names.
- **`dom-listeners`** / `dom/listeners` — `new Listeners([[type, listener]])`
  with `add(target, ...options)` and `remove(target, ...options)` to manage a
  group of listeners at once.
- **`dom-raf`** — `raf(callback) => { delta, running, cancel(), valueOf(explicit) }`;
  continuous RAF loop. `cancelAnimationFrame(handle)` also stops it.
- **`dom`** — aggregate `{ Fragment, comment, content, diff, observer, raf,
  range, signals }` when several DOM helpers are needed together.

DOM utilities require `document`, `MutationObserver`, `requestAnimationFrame`,
etc. In Node provide a DOM (linkedom/jsdom) or do not import those entries.
`content` accepts a `document` argument for SSR.

### Encoding, crypto, serialization

- **`ascii`** — `{ encode, decode }`: `string` ↔ `Uint8Array` by char code.
  ASCII-only, no Unicode validation; decoding very large buffers can exceed the
  `String.fromCharCode` argument limit.
- **`base64`** — `{ encode, decode, stream, Transformer }`.
  `encode(BlobPart, options?)` and `decode(string, options?)` are async;
  `stream(string, options?) => Response` is sync; `Transformer` is a
  `TransformStream` class.
  `decode` returns `string | ArrayBuffer`. Pass `{ format }` symmetrically for
  compression (`brotli`, `gzip`, `deflate`, `deflate-raw`, `zstd`),
  `{ buffer: true }` for raw bytes, `{ alphabet: 'base64url' }` when needed.
  Standalone subpaths: `base64/encode`, `base64/decode`, `base64/stream`,
  `base64/transformer`. Older browsers need `import '@ungap/base64'` first.
- **`password`** — `password(secret, keyOptions?) => { encrypt, decrypt }`;
  Mobile-first PBKDF2 recommendation: 32,000 iterations. Use 64,000–128,000 where
  stronger work factor is acceptable and 600,000+ for server/high-security profiles.
  Weak-password protection should additionally use a server-only `pepper`; the pepper
  must remain outside envelopes and the browser. Supports `{ buffer: true }`,
  `{ format }`, and `{ alphabet }` like `base64`.
- **`json-callback`** / `json/callback` — `toJSONCallback(fn) => source string`;
  normalizes method shorthand to named `function` form so it can be revived.
- **`json`** — aggregate `{ callback, storage }`.

### Text, Python, WebAssembly

- **`dedent`** — template tag or string function; removes the indentation of the
  first non-empty line from every line.
- **`plain-tag`** — template tag that returns the interpolated plain string.
- **`string`** — `string.split(content, re = /\r?\n/g)` generator; iterates
  lines without allocating an array.
- **`python-tag`** — `const py = await pythonTag(module?, ...loaderArgs)` boots
  Pyodide (default) or MicroPython. Use ``py`...` ``, `py(code, options)`, or
  `py({ sync: true })` to bind options. The last expression's value is returned;
  `.interpreter` exposes the loader instance. Remote import + WASM.
- **`libwabt`** — `const wabt = await libwabt(moduleArg?)`; parse/validate WAT
  and read WASM with the vendored WABT build. Call `destroy()` on parsed
  modules. Bundles the WASM payload as compressed base64.
- **`wat-tag`** — `watTag({ features, init, import, binary, name })` returns an
  async WAT template tag. Each invoke resolves to
  `{ module, instance, [dispose]() }`; use `using` or call the dispose symbol.

### Compatibility patches

- **`patch/dispose`** — exports `Symbol.dispose` or `Symbol.for('dispose')`. It
  never defines the native symbol.
- **`patch/set-union`** — import for its side effect to polyfill
  `Set.prototype.union` when missing. Required for nested `batch` on older
  engines.
- **`prefixed`** — internal name helper, not exported; never import it.

## Cross-cutting behavior

### `put` conventions

Every `Map`/`WeakMap` subclass here — `map`, `cache`, `registry`, `weakmap` —
adds `put(key, value)`, which stores like `set` but returns the **value**.
Every `Set`/`WeakSet` subclass — `set`, `weakset` — adds `put(value)`, which
returns the **value**. Use `put` to keep a value in the expression; use `set` /
`add` when chaining on the collection is needed. `json-storage` follows the same
contract without being a `Map` subclass.

### Resource lifecycle

- `dispose` is the symbol from `patch/dispose`. Prefer `using x = ...` when the
  runtime supports `Symbol.dispose`, otherwise call `x[dispose]()`.
- Dispose signals/computeds/states, `python-tag`/`libwabt`/`wat-tag` modules, and
  `dom-raf` loops when done. `dom-raf.cancel()` is idempotent.
- `dom-observer` is sticky and realm-wide: subscribe rather than creating
  another observer.

### Runtime matrix

| Area | Needs |
| --- | --- |
| DOM utilities | `document`, `MutationObserver`, `Element`, `requestAnimationFrame` |
| `base64`, `password` | `Blob`, `Uint8Array.toBase64`/`fromBase64`, `CompressionStream`, `Response` |
| `password` | the above plus `crypto.subtle` |
| `libwabt`, `wat-tag` | WebAssembly, `Blob`, `URL.createObjectURL` |
| `python-tag` | network import of the interpreter module + WebAssembly |
| signals / state / ref / dom | nested `batch` needs `Set.prototype.union` (`patch/set-union`) |
| `fetch` | global `fetch` at import time |
| `global` | import before any code that may pollute globals |

CI runs Node 26. There are no runtime dependencies and no build step for
consumers.

## Gotchas checklist

- `accessor` / `async-accessor`: declaring `get` with parameters or `set`
  without exactly one parameter breaks TypeScript inference; the runtime branch
  uses the accessor call's argument count.
- `bound` / `bound-once`: only for method access. Reading a non-function
  property through the proxy throws (`target[prop].bind`).
- `bound`: new function per access. If identity matters, use `bound-once`.
- `cache`: entries vanish on the next microtask by default. Not a durable cache.
- `registry`: `new Registry(options)` is wrong; pass `null` first
  (`new Registry(null, options)`).
- `json-storage`: values whose `stringify` yields `null`/`undefined` remove the
  key rather than storing them.
- `id` / `ref-id`: per-factory counters, not globally unique; they wrap at
  `int32`; `ref-id` ids can be reused after GC.
- `ascii`: does not encode Unicode. Use `TextEncoder` / `base64` for real text.
- `base64`: `format`, `alphabet`, and other options must match on encode and
  decode. `decode` returns a string unless `{ buffer: true }`.
- `password`: start with 32,000 PBKDF2 iterations for mobile-first latency. Raise
  to 64,000–128,000 for stronger offline resistance or 600,000+ for server profiles.
  Use a server-only pepper for weak passwords. Encryption and decryption must share
  iterations and pepper; benchmark evidence is in PR #14.
- `signals`: dependency lists are explicit; no auto-tracking. A source write
  with a new value notifies dependents even if the computed result is identical.
  Same-value writes are no-ops unless the signal is eager.
- `state-signals`: getter-only properties become `Computed`s over every signal
  present at first read; `state[dispose]()` only disposes signals `create`
  allocated, not reused inputs.
- `dom-signals` / `dom-observer`: import early, DOM required; detached nodes
  stop reacting and reattached nodes resync.
- `dom-fragment`: after insertion it is a live range, not a normal fragment;
  `valueOf()` gathers the range back before a reinsert.
- `dom-diff`: without a pin (or a bound pin) it cannot place nodes; it returns
  `future` so keep feeding it back. `current === future` skips removals by
  design (in-place reorder).
- `dom-listeners`: removal options must match addition options (`capture`).
- `dom-raf`: the next frame is scheduled before the callback, so calling
  `cancel()` inside the callback works.
- `fetch`: reading a body twice fails because the response body is consumed; a
  non-OK body read rejects with the `Response`, not an `Error`.
- `unthenable`: only the `then` field is filtered; every other trap still fires.
- `global`: protects only properties read through it, only after import. It is
  not a security boundary.
- `sticky`: first definition wins for the realm; do not put sensitive values in
  a global symbol slot.
- `all`: for many values, not a replacement for `await` on a single promise.
- `iterable`: mutates the passed object by adding `Symbol.iterator`.

## Contributing in this repo

Layout:

```
src/<utility>.js         implementation + JSDoc (types are generated from it)
src/<group>/...          grouped modules (signals, dom, base64, ascii, bound, ...)
test/<utility>.js        Node test, imported by package.json#tests
test/<utility>.html      manual browser harness when DOM APIs are required
types/                   generated .d.ts files (committed)
build/libwabt.js         regenerates the vendored WABT payload
src/README.md            canonical per-utility documentation
README.md                index / summary
```

Commands:

- `npm test` — runs each entry of `package.json#tests` sequentially with
  `node --expose-gc --localstorage-file './test/.storage'`.
- `npm run build:types` — regenerates `types/` from JSDoc with `tsc` (the
  script currently targets `src/*.js`, `src/dom/*.js`, and `src/patch/*.js`;
  extend it when adding another grouped folder).
- `npm run build` — types + tests (what CI runs).
- `npm run coverage` — c8 LCOV report.
- `npm run fetch:libwabt` / `npm run build:libwabt` — refresh the vendored WABT
  files (network + regeneration).

Rules:

- Keep it plain ESM JavaScript with `// @ts-check` and JSDoc. Do not add a
  bundler, transpiler, CJS output, or runtime dependency.
- One utility per subpath. Default export for a single primitive, named exports
  for a module that groups several.
- Prefer platform APIs and tiny implementations. This project is deliberately
  minimal and performance-oriented.
- Do not add polyfills except explicit `patch/*` entries.
- Tests import `../src/<utility>.js` directly, not package subpaths.
- Aim for 100% coverage; CI runs the build, the tests, and coverage.
- `types/` are generated: never hand-edit them.

### Definition of done for a new utility

1. `src/<utility>.js` with complete JSDoc and the existing style.
2. `test/<utility>.js` (or an HTML harness for DOM-only behavior) with
   assertions, and add the name to `package.json#tests`.
3. `package.json` `exports` entry (plus `types` mapping); add aliases only when
   they match existing conventions.
4. `npm run build:types` and commit the regenerated `types/` files.
5. Document the utility in `src/README.md` (canonical, with a usage example) and
   add one line to the root `README.md` list.
6. `npm run build` passes locally.
