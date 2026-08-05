export type PythonTagOptions = {
    /**
     * When `true`, use synchronous `runPython` instead of
     * `runPythonAsync`. Removed before options are passed to the interpreter.
     */
    sync?: boolean;
    /**
     * Optional Python dictionary used as globals (Pyodide).
     */
    globals?: any;
    /**
     * Optional Python dictionary used as locals (Pyodide).
     */
    locals?: any;
    /**
     * Optional file name for tracebacks (Pyodide).
     */
    filename?: string;
};
export type PythonTag = {
    interpreter: any;
    (strings: TemplateStringsArray, ...values: any[]): Promise<any>;
    (code: string, options: PythonTagOptions & {
        sync: true;
    }): any;
    (code: string, options?: PythonTagOptions & {
        sync?: false;
    }): Promise<any>;
    (options: PythonTagOptions & {
        sync: true;
    }): (strings: TemplateStringsArray, ...values: any[]) => any;
    (options: PythonTagOptions & {
        sync?: false;
    }): (strings: TemplateStringsArray, ...values: any[]) => Promise<any>;
};
export default _default;
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
declare function _default(module?: string, ...rest: any[]): Promise<PythonTag>;
