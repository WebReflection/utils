declare function _default<T extends Record<string, Element>>(contents: T, document?: Document): { [K in keyof T]: (value: string) => DocumentFragment; };
export default _default;
