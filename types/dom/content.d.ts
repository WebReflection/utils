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
export declare const html: (value: string, detach?: boolean) => DocumentFragment | ChildNode;
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
export declare const svg: (value: string, detach?: boolean) => DocumentFragment | ChildNode;
