/**
 * @module saij/core/Errors
 */

/**
 * @enum {number}
 */
export default {
  /**
   * Triggered when an item is added to the collection but matches
   * another element and disallow unique is set to true.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_UNIQUE: {
    code: 3,
    message: 'Assertion failed. See https://docs.saij.io/latest/errors/#3 for details.'
  }
};
