// @ts-check

/**
 * @param {number} [start]
 * @returns {() => number}
 */
export default (start = 0) => {
  const id = new Int32Array([start]);
  return () => id[0]++;
};
