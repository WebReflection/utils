/**
 * Split via RegExp and yield each chunk around the split.
 * Useful to avoid bloating long content into an array to then
 * search via `includes(content)` or loop it over again.
 * @param {string} content
 * @param {RegExp} re
 * @returns
 */
export declare function split(content: string, re?: RegExp): Generator<string, void, unknown>;
