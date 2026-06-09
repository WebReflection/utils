// @ts-check
// this is a minimalistic JSON DOM facade

const { isArray } = Array;
const { freeze } = Object;

export const ELEMENT = 1;
export const ATTRIBUTE = 2;
export const TEXT = 3;
export const DATA = 4;
export const COMMENT = 8;
export const DOCUMENT_TYPE = 10;
export const FRAGMENT = 11;
export const COMPONENT = 42;

/** @typedef {ELEMENT | ATTRIBUTE | TEXT | DATA | COMMENT | DOCUMENT_TYPE | FRAGMENT | COMPONENT} TYPE */
/** @typedef {Element | Fragment | Component} Container */

export const TEXT_ELEMENTS = new Set([
  'plaintext',
  'script',
  'style',
  'textarea',
  'title',
  'xmp',
]);

export const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'keygen',
  'link',
  'menuitem',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

export const props = /** @type {Record<string, unknown>} */(/** @type {unknown} */(freeze({})));

export const children = /** @type {Node[]} */(/** @type {unknown} */(freeze([])));

/**
 * @param {Container} node
 * @param {Node} child
 * @returns
 */
export const append = (node, child) => {
  if (node.children === children) node.children = [];
  node.children.push(child);
  child.parent = node;
  return child;
};

/**
 * @param {Element | Component} node
 * @param {string} name
 * @param {unknown} value
 */
export const prop = (node, name, value) => {
  if (node.props === props) node.props = {};
  node.props[name] = value;
};

/**
 * @param {Node} source
 * @param {Node} target
 */
export const replaceWith = (source, target) => {
  const { children } = /** @type {Container} */(source.parent);
  children[children.indexOf(source)] = target;
  target.parent = source.parent;
  source.parent = null;
};

/**
 * @param {Node} node
 */
export const remove = node => {
  const { parent } = node;
  if (parent) {
    const { children } = parent;
    children.splice(children.indexOf(node), 1);
    node.parent = null;
  }
};

const addJSON = (value, comp, json) => {
  if (value !== comp) json.push(value);
  return json;
};

const setChildren = (node, json) => {
  node.children = json.map(revive, node);
};

const setJSON = (node, json, index) => {
  switch (json.length) {
    case index: setChildren(node, /** @type {unknown[]} */(json[index - 1]));
    case index - 1: {
      const value = json[index - 2];
      if (isArray(value)) setChildren(node, value);
      else node.props = { .../** @type {Record<string, unknown>} */(value) };
    }
  }
  return node;
};

function revive(json) {
  const node = /** @type {Container | Comment | DocumentType | Text} */(fromJSON(json));
  node.parent = this;
  return node;
}

/**
 * Revives a JSON-encoded DOM node.
 * @param {unknown[]} json
 * @returns {Container | Comment | DocumentType | Text | undefined}
 */
export const fromJSON = json => {
  switch (json[0]) {
    case COMMENT: return new Comment(/** @type {string} */(json[1]));
    case DOCUMENT_TYPE: return new DocumentType(/** @type {string} */(json[1]));
    case TEXT: return new Text(/** @type {string} */(json[1]));
    case COMPONENT: return setJSON(new Component, json, 3);
    case ELEMENT: return setJSON(new Element(/** @type {string} */(json[1]), !!/** @type {boolean} */(json[2])), json, 5);
    case FRAGMENT: {
      const node = new Fragment;
      if (1 < json.length) node.children = /** @type {unknown[]} */(json[1]).map(revive, node);
      return node;
    }
  }
};

export class Node {
  /** @type {Container | null} */
  parent = null;

  /**
   * @param {TYPE} type
   */
  constructor(type) {
    this.type = type;
  }

  toJSON() {
    //@ts-ignore
    return [this.type, this.data];
  }
}

export class Comment extends Node {
  /**
   * @param {string} data
   */
  constructor(data) {
    super(COMMENT);
    this.data = data;
  }

  toString() {
    return `<!--${this.data}-->`;
  }
}

export class DocumentType extends Node {
  /**
   * @param {string} data
   */
  constructor(data) {
    super(DOCUMENT_TYPE);
    this.data = data;
  }

  toString() {
    return `<!${this.data}>`;
  }
}

export class Text extends Node {
  /**
   * @param {string} data
   */
  constructor(data) {
    super(TEXT);
    this.data = data;
  }

  toString() {
    return this.data;
  }
}

export class Component extends Node {
  name = 'template';

  constructor() {
    super(COMPONENT);
    this.props = props;
    this.children = children;
  }

  toJSON() {
    return addJSON(
      this.children,
      children,
      addJSON(
        this.props,
        props,
        [COMPONENT]
      )
    );
  }

  toString() {
    let attrs = '';
    for (const key in this.props) {
      const value = this.props[key];
      if (value != null) {
        if (typeof value === 'boolean') {
          if (value) attrs += ` ${key}`;
        }
        else attrs += ` ${key}="${value}"`;
      }
    }
    return `<template${attrs}>${this.children.join('')}</template>`;
  }
}

export class Element extends Node {
  /**
   * @param {string} name
   * @param {boolean} xml
   */
  constructor(name, xml = false) {
    super(ELEMENT);
    this.name = name;
    this.xml = xml;
    this.props = props;
    this.children = children;
  }

  toJSON() {
    return addJSON(
      this.children,
      children,
      addJSON(
        this.props,
        props,
        [ELEMENT, this.name, +this.xml]
      )
    );
  }

  toString() {
    const { xml, name, props, children } = this;
    const { length } = children;
    let html = `<${name}`;
    for (const key in props) {
      const value = props[key];
      if (value != null) {
        if (typeof value === 'boolean') {
          if (value) html += xml ? ` ${key}=""` : ` ${key}`;
        }
        else html += ` ${key}="${value}"`;
      }
    }
    if (length) html += `>${children.join('')}</${name}>`;
    else if (xml) html += ' />';
    else html += VOID_ELEMENTS.has(name) ? '>' : `></${name}>`;
    return html;
  }
}

export class Fragment extends Node {
  name = '#fragment';

  constructor() {
    super(FRAGMENT);
    this.children = children;
  }

  toJSON() {
    return addJSON(
      this.children,
      children,
      [FRAGMENT]
    );
  }

  toString() {
    return this.children.join('');
  }
}
