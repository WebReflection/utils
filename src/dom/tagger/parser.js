import WeakMap from '../../weakmap.js';

const NUL = '\x00';
const templates = new WeakMap;

const relate = (template, values, content) => {
  const fragment = content(template.join(NUL), false);
  const updates = [];
  return [fragment, function (value, i) {

  }];
};

const parse = (template, values, content) => {
  const [fragment, updates] = templates.get(template) || templates.put(template, relate(template, values, content));
  const node = document.importNode(fragment, true);
  values.forEach(updates, node);
  return node;
};

export default content => (template, ...values) => parse(template, values, content);
