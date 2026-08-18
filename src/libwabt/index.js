import decode from '../base64/decode.js';
import libwabt from './libwabt.wasm.js';
import WabtModule from './libwabt.js';

/**
 * Bootstraps the libwabt module from the WebAssembly Binary Toolkit (WABT).
 * @see https://github.com/WebAssembly/wabt/tree/main - libwabt.js
 * @param {object} [moduleArg={}]
 * @returns
 */
export default async (moduleArg = {}) => {
  const url = URL.createObjectURL(
    new Blob([
      await decode(libwabt, { format: 'deflate', buffer: true })],
      { type: 'application/wasm' }
    )
  );
  const wabt = await WabtModule({ ...moduleArg, locateFile: () => url });
  URL.revokeObjectURL(url);
  return wabt;
};
