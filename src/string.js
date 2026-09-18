/**
 * Split via RegExp and yield each chunk around the split.
 * Useful to avoid bloating long content into an array to then
 * search via `includes(content)` or loop it over again.
 * @param {string} content
 * @param {RegExp} re
 * @returns
 */
export function* split(content, re = /\r?\n/g) {
  let p = 0, match;
  while (match = re.exec(content)) {
    yield content.slice(p, match.index);
    p = match.index + match[0].length;
  }
  yield content.slice(p);
}
