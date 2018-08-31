/**
 * @module saij/core/Errors
 */

/* eslint no-magic-numbers: 0 */
/* eslint max-len: 0 */


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
    message: '[ERROR #3]: item is added to the collection but matches another element.'
  },

  /**
   * Triggered when an connection is initialized with an an object that is
   * is not {@link module:saij/connection/Connection~Connectable}.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CONNECTABLE: {
    code: 4,
    message: '[ERROR #4]: connection is initialized with an an object that is not connectable.'
  },

  /**
   * Triggered when a connection is initialized with a
   * {@link module:saij/connection/Connection~ConnectionKey} that does not
   * contain an id string.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CONNECTION_ID: {
    code: 5,
    message: '[ERROR #5]: connection is initialized with a connection key that does not contain an id string.'
  },

  /**
   * Triggered when a connection is initialized with a
   * {@link module:saij/connection/Connection~ConnectionKey} that does not
   * contain a type string.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CONNECTION_TYPE: {
    code: 6,
    message: '[ERROR #6]: connection is initialized with a connection key that does not contain a compatible type.'
  },

  /**
   * Triggered when a connection is initialized without a
   * {@link module:saij/connection/Connection~ConnectionKey}.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CONNECTION_KEY: {
    code: 7,
    message: '[ERROR #7]: connection is initialized without a connection key.'
  },

  /**
   * Triggered when a connector is created without a
   * {@link module:saij/connection/Connector~ConnectionKeyFunction}.
   * @type {module:saij/core/AssertionError~AssertionError}
   * @api
   */
  ASSERT_CON_KEY_FUNCTION: {
    code: 8,
    message: '[ERROR #8]: connector is created without a connection key function.'
  }
};
