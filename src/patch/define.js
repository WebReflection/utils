const { defineProperty } = Object;

/**
 * Define a property on `object` unless it already exists.
 * @param {object} object the target object
 * @param {PropertyKey} name the property to define
 * @param {unknown} value the property value
 * @returns {boolean} `true` when the property was defined by this call
 */
export default (object, name, value) => !(
  (name in object) || !defineProperty(object, name, {
    configurable: true,
    writable: true,
    value
  })
);
