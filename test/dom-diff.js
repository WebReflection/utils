import diff from '../src/dom/diff.js';

const parentNode = {
  insertBefore: (node, pin) => {},
};

function before() {}
function remove() {}
const create = () => ({ parentNode, before, remove, nodeType: 1 });

const pin = { isConnected: false, parentNode, before };
let list = diff([], [create(), create()], pin);
pin.isConnected = true;
list = diff(list, list.concat(create()), pin);
parentNode.moveBefore = (node, pin) => {};
list = diff(list, list.concat().reverse(), pin);
list = diff(list, list.slice(1), pin);
list = diff(list, [], pin);
