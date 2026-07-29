const { defineProperty } = Object;

export default (object, name, value) => !(
  (name in object) || !defineProperty(object, name, {
    configurable: true,
    writable: true,
    value
  })
);
