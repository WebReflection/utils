export type PersistentFragment = Omit<DocumentFragment, 'firstChild' | 'lastChild'> & {
    firstChild: ChildNode;
    lastChild: ChildNode;
    before(...nodes: (Node | string)[]): void;
    remove(): void;
    replaceWith(node: Node): void;
    valueOf(): PersistentFragment;
};
export default _default;
/**
 * @param {DocumentFragment} fragment
 * @returns {PersistentFragment}
 */
declare function _default(fragment: DocumentFragment): PersistentFragment;
