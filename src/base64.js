// @ts-check
import decode from './base64/decode.js';
import encode from './base64/encode.js';
import stream from './base64/stream.js';
import Transformer from './base64/transformer.js';

/** @typedef {'base64' | 'base64url'} Alphabet */
/** @typedef {'brotli' | 'gzip' | 'deflate' | 'deflate-raw' | 'zstd'} Format */

export { decode, encode, stream, Transformer };
