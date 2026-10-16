/** @type {Map<string, EventListenerOrEventListenerObject>} */
export default class extends Map {

  /**
   * Add all listeners to the target.
   * @param {EventTarget} target
   * @param  {...(AddEventListenerOptions | boolean)} options
   * @returns
   */
  add(target, ...options) {
    for (const [type, value] of this)
      target.addEventListener(type, value, ...options);
    return this;
  }

  /**
   * Remove all listeners from the target.
   * @param {EventTarget} target
   * @param  {...(EventListenerOptions | boolean)} options
   * @returns 
   */
  remove(target, ...options) {
    for (const [type, value] of this)
      target.removeEventListener(type, value, ...options);
    return this;
  }
}
