export default _default;
/**
 * @param {(now: number) => void} callback
 * @returns
 */
declare function _default(callback: (now: number) => void): {
    /**
     * Returns the time delta between frames
     * @type {number}
     */
    readonly delta: number;
    /**
     * Returns whether the animation is still running
     * @type {boolean}
     */
    readonly running: boolean;
    /**
     * Cancel the animation frame
     */
    cancel(): void;
    /**
     * Get the current requestAnimationFrame if
     * the optional `explicit` parameter is `true` or
     * allow `cancelAnimationFrame(this)` to cancel
     * @param {boolean} [explicit=false]
     */
    valueOf(explicit?: boolean): number;
};
