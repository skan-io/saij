/**
 * @module saij/core/utils/object
 */

/* eslint guard-for-in: 0 */
/* eslint no-unused-vars: 0 */


/**
 * Polyfill for Object.assign().  Assigns enumerable and own properties from
 * one or more source objects to a target object.
 * See https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign.
 *
 * @param {!Object} target The target object.
 * @param {...Object} var_sources The source object(s).
 * @return {!Object} The modified target object.
 */
/* istanbul ignore next */
export const assign = (typeof Object.assign === 'function')
  /* istanbul ignore next */
  ? Object.assign : /* istanbul ignore next */ function(target, var_sources) {
    /* istanbul ignore next */
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    /* istanbul ignore next */
    const output = Object(target);
    /* istanbul ignore next */
    for (let i = 1, ii = arguments.length; i < ii; i += 1) {
      // eslint-disable-next-line
      const source = arguments[i];
      /* istanbul ignore next */
      if (source !== undefined && source !== null) {
        /* istanbul ignore next */
        for (const key in source) {
          /* istanbul ignore next */
          if (source.hasOwnProperty(key)) {
            /* istanbul ignore next */
            output[key] = source[key];
          }
        }
      }
    }
    /* istanbul ignore next */
    return output;
  };


/**
 * Removes all properties from an object.
 * @param {Object} object The object to clear.
 */
export function clear(object) {
  for (const property in object) {
    Reflect.deleteProperty(object, property);
  }
}


/**
 * Get an array of property values from an object.
 * @param {Object<K,V>} object The object from which to get the values.
 * @return {!Array<V>} The property values.
 * @template K,V
 */
export function getValues(object) {
  const values = [];
  for (const property in object) {
    values.push(object[property]);
  }
  return values;
}


/**
 * Determine if an object has any properties.
 * @param {Object} object The object to check.
 * @return {boolean} The object is empty.
 */
export function isEmpty(object) {
  let property = false;
  for (property in object) {
    return false;
  }
  return !property;
}
