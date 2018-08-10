/**
 * @module saij/core/Event
 */

/**
 * @classdesc
 * Stripped down implementation of the W3C DOM Level 2 Event interface.
 * See https://www.w3.org/TR/DOM-Level-2-Events/events.html#Events-interface.
 *
 * This implementation only provides `type` and `target` properties, and
 * `stopPropagation` and `preventDefault` methods. It is meant as base class
 * for higher level events defined in the library, and works with
 * {@link module:saij/core/Target~Target}.
 */
class Event {

  /**
   * @param {string} type Type.
   */
  constructor(type) {

    /**
     * @type {boolean}
     */
    this.propagationStopped = false;

    /**
     * The event type.
     * @type {string}
     * @api
     */
    this.type = type;

    /**
     * The event target.
     * @type {Object}
     * @api
     */
    this.target = null;
  }

  /**
   * Stop event propagation.
   * @function
   * @api
   */
  preventDefault() {
    this.propagationStopped = true;
  }

  /**
   * Stop event propagation.
   * @function
   * @api
   */
  stopPropagation() {
    this.propagationStopped = true;
  }
}

export default Event;


/**
 * @param {Event|module:saij/core/Event} evt Event
 */
export function stopPropagation(evt) {
  evt.stopPropagation();
}


/**
 * @param {Event|module:saij/core/Event} evt Event
 */
export function preventDefault(evt) {
  evt.preventDefault();
}
