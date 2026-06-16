const { hasOwn, prototype: { hasOwnProperty } } = Object;

export default hasOwn || ((target, prop) => hasOwnProperty.call(target, prop));
