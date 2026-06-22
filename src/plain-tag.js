// @ts-check

/**
 * Transform a generic template function tag into a plain string.
 * @param {TemplateStringsArray} strings
 * @param {...any} values
 * @returns {string}
 */
export default (strings, ...values) => {
  let i = 0, l = values.length, s = strings[i];
  while (i < l) s += values[i] + strings[++i];
  return s;
};
