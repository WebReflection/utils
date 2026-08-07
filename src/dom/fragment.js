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
    const { firstChild } = fragment;
    super(fragment);
    this.#firstChild = fragment.insertBefore(createComment('<>'), firstChild);
    this.#lastChild = fragment.appendChild(createComment('</>'));
    this.#nodes = [...fragment.childNodes];
  }

  get firstChild() { return this.#firstChild }
  get lastChild() { return this.#lastChild }

  get previousSibling() { return this.#firstChild.previousSibling }
  get nextSibling() { return this.#lastChild.nextSibling }

  get parentNode() { return this.#firstChild.parentNode }

  /** @param {...(Node | string)} nodes */
  after(...nodes) { this.#lastChild.after(...nodes) }

  /** @param {...(Node | string)} nodes */
  append(...nodes) { this.#lastChild.before(...nodes) }

  /** @param {...(Node | string)} nodes */
  before(...nodes) { this.#firstChild.before(...nodes) }

  /** @param {...(Node | string)} nodes */
  prepend(...nodes) { this.#firstChild.after(...nodes) }

  remove() { this.#drop().remove() }

  /** @param {Node} node */
  replaceWith(node) { this.#drop().replaceWith(node) }

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
