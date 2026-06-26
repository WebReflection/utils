const { replace } = '';

/**
 * @param {Function} callback
 * @returns {string}
 */
export default callback => replace.call(
  callback,
  /^(async\s*)?(\bfunction\b)?(.*?)\(/,
  (_, isAsync, fn, name) => (
    name && !fn ?
      `${isAsync || ''}function ${name}(` :
      _
  ),
);
