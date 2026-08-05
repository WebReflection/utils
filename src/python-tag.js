// @ts-check

import { array } from './empty.js';
import plainTag from './plain-tag.js';
import dedent from './dedent.js';

const { isArray } = Array;
const { defineProperty, entries } = Object;

/**
 * Options forwarded to Pyodide's `runPython` / `runPythonAsync`, plus an optional
 * `sync` flag consumed by this utility (stripped before the interpreter call).
 * MicroPython's WASM API accepts the code string only, so fields like `globals`
 * are ignored. `sync` remains handled here and is stripped before the call.
 *
 * @see https://pyodide.org/en/stable/usage/api/js-api.html#pyodide.runPython
 * @typedef {object} PythonTagOptions
 * @property {boolean} [sync] When `true`, use synchronous `runPython` instead of
 *  `runPythonAsync`. Removed before options are passed to the interpreter.
 * @property {any} [globals] Optional Python dictionary used as globals (Pyodide).
 * @property {any} [locals] Optional Python dictionary used as locals (Pyodide).
 * @property {string} [filename] Optional file name for tracebacks (Pyodide).
 */

/**
 * Bootstrapped Python runner: template tag, string executor, or options binder.
 * Also exposes the underlying interpreter as `.interpreter`.
 *
 * @typedef {{
 *   interpreter: any;
 *   (strings: TemplateStringsArray, ...values: any[]): Promise<any>;
 *   (code: string, options: PythonTagOptions & { sync: true }): any;
 *   (code: string, options?: PythonTagOptions & { sync?: false }): Promise<any>;
 *   (options: PythonTagOptions & { sync: true }): (
 *     strings: TemplateStringsArray,
 *     ...values: any[]
 *   ) => any;
 *   (options: PythonTagOptions & { sync?: false }): (
 *     strings: TemplateStringsArray,
 *     ...values: any[]
 *   ) => Promise<any>;
 * }} PythonTag
 */

/**
 * Bootstrap a Pyodide or MicroPython WASM interpreter and return a multi-call
 * runner usable as a template tag, as `py(code, options?)`, or as
 * `py(options)` to bind options for later tagged invokes.
 *
 * The module URL is dynamically imported; `loadMicroPython` is preferred when
 * present, otherwise `loadPyodide`. Extra arguments are forwarded to that loader.
 *
 * @param {string} [module='https://esm.run/pyodide'] Module URL to import.
 * @param {...any} rest Arguments passed to `loadMicroPython` or `loadPyodide`.
 * @returns {Promise<PythonTag>}
 */
export default async (module = 'https://esm.run/pyodide', ...rest) => {
  const interpreter = await import(module).then(
    module => (module.loadMicroPython ?? module.loadPyodide)(...rest)
  );

  /**
   * @this {readonly any[]}
   * @param {TemplateStringsArray | ArrayLike<string>} template
   * @param {...any} values
   * @returns {any}
   */
  function run(template, ...values) {
    /** @type {readonly any[]} */
    let options = this;
    let method = 'runPythonAsync';
    if (this.length && this[0].sync) {
      method = 'runPython';
      /** @type {Record<string, any>} */
      const cleaned = {};
      for (const [key, value] of entries(this[0])) {
        if (key !== 'sync') cleaned[key] = value;
      }
      options = [cleaned];
    }
    return interpreter[method](
      dedent(
        plainTag(/** @type {TemplateStringsArray} */ (template), ...values)
      ),
      ...options
    );
  }

  return /** @type {PythonTag} */ (defineProperty(
    /**
     * @param {any} template
     * @param {...any} values
     */
    (template, ...values) => isArray(template) ?
      run.call(array, template, ...values) :
      (typeof template === 'string' ?
        run.call(values, [template]) :
        run.bind([template])),
    'interpreter',
    { value: interpreter }
  ));
};
