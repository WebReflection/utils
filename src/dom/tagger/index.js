import * as content from '../content.js';
import parser from './parser.js';

export const html = parser(content.html);
export const svg = parser(content.svg);
