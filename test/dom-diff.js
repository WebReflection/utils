import diff from '../src/dom/diff.js';

const parentNode = {
  insertBefore: (node, pin) => {},
};

function remove() {}

const pin = { isConnected: false, parentNode };
let list = diff([], [{ parentNode, remove }, { parentNode, remove }], pin);
pin.isConnected = true;
list = diff(list, list.concat({ parentNode, remove }), pin);
parentNode.moveBefore = (node, pin) => {};
list = diff(list, list.concat().reverse(), pin);
list = diff(list, list.slice(1), pin);
list = diff(list, [], pin);
