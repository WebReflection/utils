export type Diffable = ChildNode | import('./fragment.js').default;
export type DiffParent = ParentNode & {
    moveBefore?: (node: Node, child: Node | null) => Node;
};
export default _default;
/**
 * A live child node, or a persistent fragment from `dom/fragment`.
 * @typedef {ChildNode | import('./fragment.js').default} Diffable
 */
/**
 * Parent that may expose the newer `moveBefore` DOM API.
 * @typedef {ParentNode & {
 *   moveBefore?: (node: Node, child: Node | null) => Node,
 * }} DiffParent
 */
/**
 * Diff two arrays of nodes, returning the future array.
 * @param {Diffable[]} current - The current array of nodes.
 * @param {Diffable[]} future - The future array of nodes.
 * @param {ChildNode} pin - The pin node.
 * @returns {Diffable[]} The future array of nodes.
 */
declare function _default(current: Diffable[], future: Diffable[], pin: ChildNode): Diffable[];
