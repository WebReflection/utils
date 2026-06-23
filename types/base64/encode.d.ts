declare function _default(value: BlobPart, options: Options): Promise<string>;
export default _default;
export type Options = {
    alphabet?: import("../base64.js").Alphabet;
    format?: "" | import("../base64.js").Format;
    omitPadding?: boolean;
};
