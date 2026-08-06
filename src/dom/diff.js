/**
 * Diff two arrays of nodes, returning the future array.
 * @param {Node[]} current - The current array of nodes.
 * @param {Node[]} future - The future array of nodes.
 * @param {Node} pin - The pin node.
 * @returns {Node[]} The future array of nodes.
 */
export default (current, future, pin) => {
  const { isConnected, parentNode } = pin;
  const { moveBefore = parentNode.insertBefore } = parentNode;
  for (let node, i = current.length; i--;) {
    node = current[i];
    if (!future.includes(node))
      node.remove();
  }
  for (let node, i = future.length; i--;) {
    node = future[i];
    if (node.nextSibling !== pin) {
      if (isConnected && node.parentNode === parentNode)
        moveBefore.call(parentNode, node, pin);
      else
        parentNode.insertBefore(node, pin);
    }
    pin = node;
  }
  return future;
};
