const { fromCharCode } = String;

/**
 * @param {Uint8Array} view
 * @returns {string}
 */
export default view => fromCharCode(...view);
