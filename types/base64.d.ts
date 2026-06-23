export type Alphabet = "base64" | "base64url";
export type Format = "brotli" | "gzip" | "deflate" | "deflate-raw" | "zstd";
import decode from './base64/decode.js';
import encode from './base64/encode.js';
export { decode, encode };
