/**
 * @module saij/core/Errors
 */

const message = 'Assertion failed. See https://skan-io.github.io/saij/module-saij_core_Errors for details.';

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
    message: `[ERROR CODE 3] ${message}`
  },
  
  /**
   * Triggered when an connection is created without a string key.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CONNECTION_KEY: {
    code: 4,
    message: `[ERROR CODE 4] ${message}`
  }
};
