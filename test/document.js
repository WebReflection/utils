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
      return contents;
    },
  }),
};
