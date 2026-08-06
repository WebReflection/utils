export type Diffable = ChildNode | import('./fragment.js').default;
export type DiffParent = ParentNode & {
    moveBefore?: (node: Node, child: Node | null) => void;
};
export type Diff = {
    (current: Diffable[], future: Diffable[], pin: ChildNode): Diffable[];
    (this: ChildNode, current: Diffable[], future: Diffable[], pin?: ChildNode): Diffable[];
};
declare const _default: Diff;
export default _default;
