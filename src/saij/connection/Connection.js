/**
 * @module saij/connection/Connection
 */

import BaseObject from '../core/Object';
import Collection from '../core/Collection';
import AssertionError from '../core/AssertionError';
import Errors from '../core/errors';
import {unByKey} from '../core/Observable';
import ConnectionType from './ConnectionType';


/* eslint max-len: 0 */


/**
 * A {@link module:saij/connection/Connection~Connection} will be one of the
 * {@link module:saij/connection/ConnectionType}s.
 * @typedef {module:saij/connection/ConnectionType} ConnectionType
 * @property {module:saij/connection/ConnectionType} type
 * @api
 */

/**
 * Key created when a new {@link module:saij/connection/Connection~Connection}
 * is created.
 *
 * @typedef {Object} ConnectionKey
 * @property {string} id
 * @property {module:saij/connection/ConnectionType} type
 * @api
 */

/**
 * Object requirements for use with this connection object. Must contains the
 * `getInput` and `getOuput` functions, that must return {@link module:saij/core/Object}.
 * @typedef {Object} Connectable
 * @property {function} getInput returns {@link module:saij/core/Object~BaseObject}
 * @property {function} getOutput returns {@link module:saij/core/Object~BaseObject}
 * @api
*/


/**
 * Determine if an object is connectable.
 * @param  {Object} obj object to check if Connectable
 * @return {Boolean} true if object is Connectable
 * @function
 * @api
 */
export const assertConnectable = (obj)=> {
  if (
    !obj
    || typeof obj.getInput !== 'function'
    || typeof obj.getOutput !== 'function'
  ) {
    return false;
  }

  if (!(obj.getInput() instanceof BaseObject)) {
    return false;
  }

  if (!(obj.getOutput() instanceof BaseObject)) {
    return false;
  }

  return true;
};


/**
 * @classdesc
 * A connection is an abstract base class to build
 * {@link module:saij/connection/ConnectionType}s from.
 *
 * A Connection will connect the inputs and outputs of two connectable
 * objects together.  For an object to be connectable it must have `getInput`
 * and `getOutput` functions that return a {@link module:saij/core/Object}. A
 * connection will set listeners on the inputs and output that match up,
 * and forward them on to each other.
 *
 * @api
 */
class Connection extends BaseObject {
  /**
   * @param  {module:saij/connection/Connection~ConnectionKey} connectionKey connection key
   * @param  {module:saij/connection/Connection~Connectable} source forward connectable object
   * @param  {module:saij/connection/Connection~Connectable} destination reverse connectable object
   */
  // eslint-disable-next-line max-statements
  constructor(connectionKey, source, destination) {
    super();

    if (!assertConnectable(source) || !assertConnectable(destination)) {
      throw new AssertionError(Errors.ASSERT_CONNECTABLE.code);
    }

    /**
     * @private
     * @type {module:saij/connection/Connection~ConnectionKey}
     */
    this.key_ = null;
    /**
     * @private
     * @type {module:saij/connection/Connection~ConnectionType}
     */
    this.type_ = null;

    this.setKey(connectionKey);

    /**
     * @private
     * @type {module:saij/core/Collection~Collection.<module:saij/connection/Connection~Connectable>}
     */
    this.connectables_ = new Collection([source, destination]);
    /**
     * @private
     * @type {module:saij/connection/Connection~Connectable}
     */
    this.source_ = source;
    /**
     * @private
     * @type {module:saij/connection/Connection~Connectable}
     */
    this.destination_ = destination;

    /**
     * @private
     * @type {module:saij/core/Collection~Collection.<module:saij/core/utils/events~EventsKey>}
     */
    this.listeners_ = new Collection();

    /**
     * @private
     * @type {Boolean}
     */
    this.hasConnection_ = false;

    // Initialise the connection
    this.connect();
  }

  /**
   * Connect the outputs of connectable A to the inputs of
   * connectable B
   * @param {module:saij/connection/Connection~Connectable} conA connectable A
   * @param {module:saij/connection/Connection~Connectable} conB connectable B
   * @private
   */
  connectOutAtoInB_(conA, conB) {
    // Get the input and output data objects
    const outputA = conA.getOutput();
    const inputB = conB.getInput();

    for (const keyA of Reflect.ownKeys(outputA.getProperties())) {
      for (const keyB of Reflect.ownKeys(inputB.getProperties())) {
        if (keyA === keyB) {
          // Connect outputs of A to inputs of B
          this.listeners_.push(
            outputA.on(`change:${keyA}`, ()=> {
              inputB.set(keyA, outputA.get(keyA));
            })
          );
        }
      }
    }
  }

  /**
   * Check the connection is setup.
   * @return {Boolean} true if connected
   * @api
   */
  isConnected() {
    return this.hasConnection_;
  }

  /**
   * Check the connection has listeners.
   * @return {Boolean} true if has listeners
   * @api
   */
  isListening() {
    return this.listeners_.getArray().length > 0;
  }

  /**
   * Connect source to destination in the way described by the type.
   * @return {module:saij/core/Collection~Collection.<module:saij/core/utils/events~EventsKey>} listeners
   * @api
   */
  connect() {
    if (!this.hasConnection_) {
      switch (this.type_) {
        case ConnectionType.SIMPLEX: {
          this.connectOutAtoInB_(this.source_, this.destination_);
          this.hasConnection_ = true;
          return this.listeners_;
        }
        case ConnectionType.DUPLEX: {
          this.connectOutAtoInB_(this.source_, this.destination_);
          this.connectOutAtoInB_(this.destination_, this.source_);
          this.hasConnection_ = true;
          return this.listeners_;
        }
        default: {
          throw new AssertionError(Errors.ASSERT_CONNECTION_TYPE.code);
        }
      }
    }
  }

  /**
   * Disconnect the connection and clear it's listeners.
   * @return {Boolean} true if disconnected
   * @api
   */
  disconnect() {
    unByKey(this.listeners_.getArray());
    this.listeners_.clear();
    this.hasConnection_ = false;
    return true;
  }

  /**
   * Set the connection key. It is advised to use a
   * {@link module:saij/connection/Connection~ConnectionKey} with a unique id,
   * unless you wish to group connections.  Changing the key type will trigger
   * a reconnection to occur.
   * @param {module:saij/connection/Connection~ConnectionKey} key connection key
   * @return {Boolean} true if set the key
   * @api
   */
  // eslint-disable-next-line max-statements
  setKey(key) {
    if (!key) {
      throw new AssertionError(Errors.ASSERT_CONNECTION_KEY.code);
    }

    const id = key.id;
    const type = key.type;

    if (typeof id === 'string' && typeof type === 'string') {
      // Create new key object in case original object is corrupted
      this.key_ = {...key};

      if (this.hasConnection_ && type !== this.type_) {
        this.disconnect();
        this.type_ = type;
        this.connect();
        return true;
      }

      this.type_ = type;
      return true;
    }
    // A connection key id must be defined and a string
    if (typeof id !== 'string') {
      throw new AssertionError(Errors.ASSERT_CONNECTION_ID.code);
    }
    // A connection key type must be defined and a string
    throw new AssertionError(Errors.ASSERT_CONNECTION_TYPE.code);
  }

  /**
   * Get the connection key.
   * @return {module:saij/connection/Connection~ConnectionKey} connection key
   * @api
   */
  getKey() {
    return this.key_;
  }

  /**
   * Get the listeners keys for all the input/output listeners on the connection.
   * @return {module:saij/core/Collection<module:saij/core/utils/events~EventsKey>} connection key
   * @api
   */
  getListeners() {
    return this.listeners_;
  }
}

export default Connection;
