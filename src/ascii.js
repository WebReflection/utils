const { fromCharCode } = String;
const toCharCode = Uint8Array.from.bind(Uint8Array);

/**
 * @param {string} str
 * @returns
 */
export const encode = str => toCharCode(str, c => c.charCodeAt(0));

/**
 * @param {Uint8Array} view
 * @returns {string}
 */
export const decode = view => fromCharCode(...view);
