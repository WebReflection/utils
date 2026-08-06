// @ts-check
/// <reference lib="dom" />

/**
 * A live child node, or a persistent fragment from `dom/fragment`.
 * @typedef {ChildNode | import('./fragment.js').PersistentFragment} Diffable
 */

/**
 * Parent that may expose the newer `moveBefore` DOM API.
 * @typedef {ParentNode & {
 *   moveBefore?: (node: Node, child: Node | null) => void,
 * }} DiffParent
 */

/**
 * Diff two arrays of nodes, returning the future array.
 * @param {Diffable[]} current - The current array of nodes.
 * @param {Diffable[]} future - The future array of nodes.
 * @param {ChildNode} pin - The pin node.
 * @returns {Diffable[]} The future array of nodes.
 */
export default (current, future, pin) => {
  const { isConnected, parentNode } = pin;
  // @ts-ignore
  const { moveBefore = parentNode.insertBefore } = parentNode;
  for (let node, i = current.length; i--;) {
    node = current[i];
    if (!future.includes(node))
      node.remove();
  }
  for (let node, isNode = true, i = future.length; i--;) {
    node = future[i];
    isNode = node.nodeType !== 11;
    /* c8 ignore start */
    if (node.nextSibling !== pin) {
      if (isConnected && isNode && node.parentNode === parentNode)
        moveBefore.call(parentNode, node, pin);
      else
        // give persistent fragments a chance to update their children
        pin.before(isNode ? node : /** @type {Node} */ (node.valueOf()));
    }
    // give persistent fragments a chance to provide the next pin
    pin = /** @type {ChildNode} */ (isNode ? node : node.firstChild);
    /* c8 ignore stop */
  }
  return future;
};
