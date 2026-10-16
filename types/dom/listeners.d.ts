/** @type {Map<string, EventListenerOrEventListenerObject>} */
export default class extends Map {
    /**
     * Add all listeners to the target.
     * @param {EventTarget} target
     * @param  {...(AddEventListenerOptions | boolean)} options
     * @returns
     */
    add(target: EventTarget, ...options: (AddEventListenerOptions | boolean)[]): this;
    /**
     * Remove all listeners from the target.
     * @param {EventTarget} target
     * @param  {...(EventListenerOptions | boolean)} options
     * @returns
     */
    remove(target: EventTarget, ...options: (EventListenerOptions | boolean)[]): this;
}
