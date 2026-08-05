import diff from '../src/dom/tagger/diff.js';

import { html } from '../src/dom/content.js';

const a = html`<div>a</div>`;
const b = html`<div>b</div>`;
const c = html`<div>c</div>`;
const d = html`<div>d</div>`;
const e = html`<div>e</div>`;


let pin = document.createComment('pin');
let current = [a, b, c, d];

document.body.replaceChildren(...current, pin);

current = diff(current, [a, b, c, e], pin);
