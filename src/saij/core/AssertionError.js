
/**
 * @module saij/core/AssertionError
 */
import {VERSION} from './utils/uid.js';


/**
 * Error object thrown when an assertion failed. This is an ECMA-262 Error,
 * extended with a `code` property.
 * See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error.
 */
class AssertionError extends Error {

  /**
   * @param {number} code Error code.
   */
  constructor(code) {
    const path = VERSION.split('-')[0];
    // eslint-disable-next-line
    const message = 'Assertion failed. See https://docs.saij.io/' + path +
    '/errors/#' + code + ' for details.';

    super(message);

    /**
     * Error code. The meaning of the code can be found on
     * https://skan.gitbook.com/saij
     * @type {number}
     * @api
     */
    this.code = code;

    /**
     * @type {string}
     */
    this.name = 'AssertionError';

    this.message = message;
  }
}

export default AssertionError;
