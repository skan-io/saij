
/**
 * @module saij/core/utils/uid
 */

/**
 * Counter for getUid.
 * @type {number}
 * @private
 */
let uidCounter_ = 0;

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. Unique IDs are
 * generated as a strictly increasing sequence. Adapted from goog.getUid.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
export function getUid(obj) {
  // eslint-disable-next-line no-return-assign, no-plusplus
  return obj.saij_uid || (obj.saij_uid = ++uidCounter_);
}

/**
 * Saij version.
 * @type {string}
 */
export const VERSION = 'latest';
