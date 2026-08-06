declare const Fragment_base: new (target: DocumentFragment) => DocumentFragment;
export default class Fragment extends Fragment_base {
    #private;
    /**
     * @param {DocumentFragment} fragment
     */
    constructor(fragment: DocumentFragment);
    get firstChild(): Comment;
    get lastChild(): Comment;
    get parentNode(): ParentNode | null;
    /**
     * @param {...(Node | string)} nodes
     */
    before(...nodes: (Node | string)[]): void;
    remove(): void;
    /**
     * @param {Node} node
     */
    replaceWith(node: Node): void;
    valueOf(): this;
}
export {};
