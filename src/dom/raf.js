/**
 * @param {(now: number) => void} callback
 * @returns
 */
export default callback => {
  let delta = 0;
  let running = true;
  // more aligned than performance.now()
  // granting delta never being negative
  let last = /** @type {number} */(document.timeline.currentTime);
  let rAF = requestAnimationFrame(function frame(now) {
    delta = now - last;
    last = now;
    rAF = requestAnimationFrame(frame);
    callback(now);
  });
  return {
    /**
     * Returns the time delta between frames
     * @type {number}
     */
    get delta() { return delta; },

    /**
     * Returns whether the animation is still running
     * @type {boolean}
     */
    get running() { return running; },

    /**
     * Cancel the animation frame
     */
    cancel() {
      if (running) {
        running = false;
        cancelAnimationFrame(rAF);
      }
    },

    /**
     * Get the current requestAnimationFrame if
     * the optional `explicit` parameter is `true` or
     * allow `cancelAnimationFrame(this)` to cancel
     * @param {boolean} [explicit=false]
     */
    valueOf(explicit = false) {
      if (!explicit) this.cancel();
      return rAF;
    },
  };
};
