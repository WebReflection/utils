// @ts-check
/// <reference lib="dom" />

import comment from './comment.js';

const { defineProperties } = Object;

const childNodes = Symbol('childNodes');
const configurable = true;
const range = document.createRange();

/**
 * A `DocumentFragment` that can live as a persistent range between comment
 * markers, with `ChildNode`-like helpers for use with `dom/diff`.
 * @typedef {Omit<DocumentFragment, 'firstChild' | 'lastChild'> & {
 *   firstChild: ChildNode,
 *   lastChild: ChildNode,
 *   before(...nodes: (Node | string)[]): void,
 *   remove(): void,
 *   replaceWith(node: Node): void,
 *   valueOf(): PersistentFragment,
 * }} PersistentFragment
 */

/**
 * @param {Pick<PersistentFragment, 'firstChild' | 'lastChild'>} _
 * @returns {ChildNode}
 */
const drop = ({ firstChild, lastChild }) => {
  range.setStartAfter(firstChild);
  range.setEndAfter(lastChild);
  range.deleteContents();
  return firstChild;
};

const before = {
  configurable,
  /**
   * @this {PersistentFragment}
   * @param {...(Node | string)} nodes
   */
  value(...nodes) {
    this.firstChild.before(...nodes);
  }
};

const parentNode = {
  configurable,
  /**
   * @this {PersistentFragment}
   * @returns {ParentNode | null}
   */
  get() {
    return this.firstChild.parentNode;
  }
};

const remove = {
  configurable,
  /** @this {PersistentFragment} */
  value() {
    drop(this).remove();
  }
};

const replaceWith = {
  configurable,
  /**
   * @this {PersistentFragment}
   * @param {Node} node
   */
  value(node) {
    drop(this).replaceWith(node);
  }
};

const valueOf = {
  configurable,
  /**
   * @this {PersistentFragment & { [key: symbol]: Node[] }}
   * @returns {PersistentFragment}
   */
  value() {
    let { firstChild, lastChild } = this, { parentNode } = firstChild;
    if (parentNode !== this) {
      if (parentNode) {
        this[childNodes] = [firstChild];
        while (firstChild !== lastChild)
          this[childNodes].push((firstChild = /** @type {ChildNode} */ (firstChild.nextSibling)));
      }
      this.replaceChildren(...this[childNodes]);
    }
    return this;
  }
};

/**
 * @param {DocumentFragment} fragment
 * @returns {PersistentFragment}
 */
export default fragment => {
  /** @type {Node[]} */
  const value = [];
  defineProperties(fragment, {
    [childNodes]: {
      writable: true,
      value
    },
    firstChild: {
      value: fragment.insertBefore(comment('<>'), fragment.firstChild)
    },
    lastChild: {
      value: fragment.appendChild(comment('</>'))
    },
    before,
    parentNode,
    remove,
    replaceWith,
    valueOf,
  });
  value.push(...fragment.childNodes);
  return /** @type {PersistentFragment} */ (fragment);
};
