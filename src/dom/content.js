// @ts-check
/// <reference lib="dom" />

import content from '../content.js';

const fragments = content(
  {
    html: document.createElement('template'),
    svg: document.createElementNS('http://www.w3.org/2000/svg', 'svg'),
  },
  document
);

/**
 * @param {(value: string) => DocumentFragment} way
 * @returns {(value: string, detach?: boolean) => DocumentFragment | ChildNode}
 */
const create = way => (value, detach = true) => {
  const node = way(value);
  /* c8 ignore start */
  return detach && node.childNodes.length === 1
    ? /** @type {ChildNode} */ node.childNodes[0]
    : node;
  /* c8 ignore stop */
};

/**
 * Parse a string of HTML markup, in the context of a `<template>` element, and
 * return the produced nodes as a fragment.
 *
 * @param {string} value the HTML markup to parse
 * @param {boolean} [detach=true] when true and the fragment has a single child,
 *  return that child instead of the fragment
 * @returns {DocumentFragment | ChildNode} a fragment containing the parsed HTML
 *  nodes, or the single child when `detach` is true
 */
export const html = create(fragments.html);

/**
 * Parse a string of SVG markup, in the context of an `<svg>` element, and
 * return the produced nodes as a fragment.
 *
 * @param {string} value the SVG markup to parse
 * @param {boolean} [detach=true] when true and the fragment has a single child,
 *  return that child instead of the fragment
 * @returns {DocumentFragment | ChildNode} a fragment containing the parsed SVG
 *  nodes, or the single child when `detach` is true
 */
export const svg = create(fragments.svg);
