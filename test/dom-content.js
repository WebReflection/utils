import * as mock from './document.js';
import { html, svg } from '../src/dom-content.js';

console.assert(html('<div>Hello</div>') === mock.html);
console.assert(svg('<svg><circle cx="10" cy="10" r="5"/></svg>') === mock.svg);
