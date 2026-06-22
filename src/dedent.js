// @ts-check

import content from './plain-tag.js';

/**
 * @type {{
 *   object: (strings: TemplateStringsArray, ...values: any[]) => string,
 *   string: (content: string) => string
 * }}
 */
const variant = {
  object(strings, ...values) {
    return this.string(content(strings, ...values));
  },
  string(content) {
    for (const line of content.split(/[\r\n]+/)) {
      // skip initial empty lines
      if (line.trim().length) {
        // trap indentation at the very first line of code
        if (/^(\s+)/.test(line))
          content = content.replace(new RegExp('^' + RegExp.$1, 'gm'), '');
        // no indentation? all good: get out of here!
        break;
      }
    }
    return content;
  }
};

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
const dedent = (tpl, ...values) => {
  // @ts-ignore
  return variant[typeof tpl](tpl, ...values);
}

export default dedent;
