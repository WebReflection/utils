/**
 * Parse a string of HTML markup, in the context of a `<template>` element, and
 * return the produced nodes as a fragment.
 *
 * @param {string} value the HTML markup to parse
 * @returns {DocumentFragment} a fragment containing the parsed HTML nodes
 */
export const html: (value: string) => DocumentFragment;
/**
 * Parse a string of SVG markup, in the context of an `<svg>` element, and
 * return the produced nodes as a fragment.
 *
 * @param {string} value the SVG markup to parse
 * @returns {DocumentFragment} a fragment containing the parsed SVG nodes
 */
export const svg: (value: string) => DocumentFragment;
