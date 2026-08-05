export const html = {};
export const svg = {};

let contents;

globalThis.document = {
  createElement: () => html,
  createElementNS: () => svg,
  createRange: () => ({
    selectNodeContents: (node) => {
      contents = node;
    },
    createContextualFragment: () => {
      // length !== 1 so dom/content's default `detach` returns the fragment as-is
      contents.childNodes = { length: 0 };
      return contents;
    },
  }),
};
