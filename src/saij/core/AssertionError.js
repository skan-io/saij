
/**
 * @module saij/core/AssertionError
 */
import {VERSION} from './utils/uid.js';
import Errors from './Errors';


const link = 'Assertion failed. See https://skan-io.github.io/saij/module-saij_core_Errors for details.';

const getErrorMessages = ()=> {
  const errorMap = new Map();
  for (const key of Reflect.ownKeys(Errors)) {
    errorMap.set(Errors[key].code, Errors[key].message);
  }

  return errorMap;
};

const errorMessageMap = getErrorMessages();


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
    let message = errorMessageMap.get(code);

    if (!message) {
      message = '[UNKOWN ERROR] - The error code supplied is unknown.';
    }

    message += ` ${link} Version: ${VERSION}`;

    super(message);

    /**
     * Error code. The meaning of the code can be found at
     * https://skan-io.github.io/saij/module-saij_core_Errors
     * @type {number}
     * @api
     */
    this.code = code;

    /**
     * Error message. Description of the error code.
     * Check https://skan-io.github.io/saij/module-saij_core_Errors
     * @type {string}
     * @api
     */
    this.message = message;

    /**
     * @type {string}
     */
    this.name = 'AssertionError';
  }
}

export default AssertionError;
