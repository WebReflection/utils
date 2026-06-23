declare function _default(value: string, options: Options): Promise<string | ArrayBuffer>;
export default _default;
export type Options = {
    alphabet?: import("../base64.js").Alphabet;
    buffer?: boolean;
    format?: "" | import("../base64.js").Format;
    lastChunkHandling?: "loose" | "strict" | "stop-before-partial";
};
