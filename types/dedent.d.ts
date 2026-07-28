/**
 * Usable both as a template literal tag or as a function on strings. Removes
 * common leading indentation from the first non-empty line while preserving
 * everything else.
 *
 * @overload
 * @param {string} content
 * @returns {string}
 */
/**
 * @overload
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @returns {string}
 */
/**
 * @param {string | TemplateStringsArray} tpl
 * @param {...any} values
 * @returns {string}
 */
declare const dedent: (tpl: string | TemplateStringsArray, ...values: any[]) => string;
export default dedent;
