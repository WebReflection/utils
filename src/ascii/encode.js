/**
 * @param {string} str
 * @returns
 */
export default str => {
  let i = 0, length = str.length, view = new Uint8Array(length);
  while (i < length) view[i] = str.charCodeAt(i++);
  return view;
};
