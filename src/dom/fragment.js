// @ts-check
/// <reference lib="dom" />

import createComment from './comment.js';
import createRange from './range.js';
import custom from '../class.js';

const range = createRange();

export default class Fragment extends custom(DocumentFragment) {
  #firstChild;
  #lastChild;
  #nodes;

  #drop() {
    range.setStartAfter(this.#firstChild);
    range.setEndAfter(this.#lastChild);
    range.deleteContents();
    return this.#firstChild;
  }

  /**
   * @param {DocumentFragment} fragment
   */
  constructor(fragment) {
    super(fragment);
    this.#firstChild = fragment.insertBefore(createComment('<>'), fragment.firstChild);
    this.#lastChild = fragment.appendChild(createComment('</>'));
    this.#nodes = [...fragment.childNodes];
  }

  get firstChild() {
    return this.#firstChild;
  }

  get lastChild() {
    return this.#lastChild;
  }

  get parentNode() {
    return this.#firstChild.parentNode;
  }

  /**
   * @param {...(Node | string)} nodes
   */
  before(...nodes) {
    this.#firstChild.before(...nodes);
  }

  remove() {
    this.#drop().remove();
  }

  /**
   * @param {Node} node
   */
  replaceWith(node) {
    this.#drop().replaceWith(node);
  }

  valueOf() {
    let firstChild = /** @type {ChildNode} */ (this.#firstChild), { parentNode } = firstChild;
    if (parentNode !== this) {
      if (parentNode) {
        this.#nodes = [firstChild];
        while (firstChild !== this.#lastChild)
          this.#nodes.push((firstChild = /** @type {ChildNode} */ (firstChild.nextSibling)));
      }
      this.replaceChildren(...this.#nodes);
    }
    return this;
  }
}
