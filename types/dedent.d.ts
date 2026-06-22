export default dedent;
/**
 * Usable both as a template literal tag or as a function on strings. Removes
 * common leading indentation from the first non-empty line while preserving
 * everything else.
 *
 * @overload
 * @param {string} content
 * @returns {string}
 */
declare function dedent(content: string): string;
/**
 * @overload
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @returns {string}
 */
declare function dedent(strings: TemplateStringsArray, ...values: any[]): string;
