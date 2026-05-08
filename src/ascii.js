const { fromCharCode } = String;
const toCharCode = Uint8Array.from.bind(Uint8Array);

/**
 * @param {string} c
 * @returns
 */
const asCharCode = c => c.charCodeAt(0);

/**
 * @param {string} str
 * @returns
 */
export const encode = str => toCharCode(str, asCharCode);

/**
 * @param {Uint8Array} view
 * @returns {string}
 */
export const decode = view => fromCharCode(...view);
