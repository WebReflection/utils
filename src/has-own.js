const { hasOwn, prototype: { hasOwnProperty } } = Object;

export default hasOwn || /** @type {typeof Object.hasOwn} */((target, prop) => hasOwnProperty.call(target, prop));
