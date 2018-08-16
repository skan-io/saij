/**
 * @module saij/Connection
 */

import BaseObject from './core/Object';
import Collection from './core/Collection';
import AssertionError from './core/AssertionError';
import Errors from './core/Errors';
import {unByKey} from './core/Observable';

/* eslint max-len: 0 */


/**
 * Key to use with {@link module:saij/Connection~Connection} or the
 * {@link module:saij/Engine~Engine#removeConnectionByKey} and
 * {@link module:saij/Engine~Engine#getConnectionByKey} functions.
 * @typedef {string} ConnectionKey
 * @property {string} type
 * @api
 */

/**
 * Object requirements for use with this connection object. Must contains the
 * `getInput` and `getOuput` functions, that must return {@link module:saij/core/Object}.
 * @typedef {module:saij/core/Object} Connectable
 * @property {function} getInput returns {@link module:saij/core/Object}
 * @property {function} getOutput returns {@link module:saij/core/Object}
 * @api
*/


/**
 * @classdesc
 * A Connection will connect all the inputs and outputs of two connectable
 * objects together.  For an object to be connectable it must have `getInput`
 * and `getOutput` functions that return a {@link module:saij/core/Object}. A
 * connection will set listeners on the inputs and output that match up,
 * and forward them on to each other.
 * @api
 */
class Connection extends BaseObject {
  /**
   * @param  {string} key  connection key
   * @param  {module:saij/Connection~Connectable} conA connectable object
   * @param  {module:saij/Connection~Connectable} conB connectable object
   */
  constructor(key, conA, conB) {
    super();

    /**
     * @private
     * @type {module:saij/Connection~ConnectionKey}
     */
    this.key_ = key;
    this.hasConnection_ = false;

    if (typeof this.key_ !== 'string') {
      throw new AssertionError(Errors.ASSERT_CONNECTION_KEY.code);
    }

    this.cons_ = [conA, conB];
    this.conA_ = conA;
    this.conB_ = conB;

    this.listeners_ = new Collection();
    this.connect_();
  }

  /**
   * Forward and reverse connect the connections.
   * @private
   */
  connect_() {
    this.connectAtoB_();
    this.connectBtoA_();

    if (this.listeners_.getArray().length > 0) {
      this.hasConnection_ = true;
    }
  }

  /**
   * Connect the outputs of connection A to the inputs of
   * connection B
   * @private
   */
  connectAtoB_() {
    // Get the input and output data fields
    const outputA = this.conA_.getOutput();
    const inputB = this.conB_.getInput();

    for (const keyA of Reflect.ownKeys(outputA.getProperties())) {
      for (const keyB of Reflect.ownKeys(inputB.getProperties())) {
        if (keyA === keyB) {
          // Connect outputs of A to inputs of B
          this.listeners_.push(
            outputA.on(`change:${keyA}`, ()=> {
              // TODO this.attentionModulator_(organA[keyA])
              // TODO this.scheduleOutput_();
              inputB.set(keyA, outputA.get(keyA));
            })
          );
        }
      }
    }
  }

  /**
   * Connect the outputs of connection B to the inputs of
   * connection A
   * @private
   */
  connectBtoA_() {
    const inputA = this.conA_.getInput();
    const outputB = this.conB_.getOutput();

    for (const keyB of Reflect.ownKeys(outputB.getProperties())) {
      for (const keyA of Reflect.ownKeys(inputA.getProperties())) {
        if (keyA === keyB) {
          // Connect outputs of B to inputs of A
          this.listeners_.push(
            outputB.on(`change:${keyB}`, ()=> {
              inputA.set(keyB, outputB.get(keyB));
            })
          );
        }
      }
    }
  }

  /**
   * True if the connection contains listeners.
   * @api
   */
  isConnected() {
    return this.hasConnection_;
  }

  /**
   * Unset all the listeners held by the connection, and
   * clear the listeners.
   * @api
   */
  disconnect() {
    unByKey(this.listeners_.getArray());
    this.listeners_.clear();
    this.hasConnection_ = false;
  }

  /**
   * Set the connection key. It is advised to use unique
   * key names, unless you want to group connections.
   * @param {string} key connection key
   * @api
   */
  setKey(key) {
    if (typeof key === 'string') {
      this.key_ = key;
    }
  }

  /**
   * Get the connection key.
   * @return {string} connection key
   * @api
   */
  getKey() {
    return this.key_;
  }

  /**
   * Get the listeners keys for all the input/output listeners.
   * @return {module:saij/core/Collection<module:saij/core/utils/events~EventsKey>} connection key
   * @api
   */
  getListeners() {
    return this.listeners_;
  }
}

export default Connection;


/**
 * @classdesc
 * A connector is a helper class, that you can instantiate with a key generating
 * function, that when `connect` is called between two connectables, a key
 * will be created and a new {@link module:saij/Connection~Connection} will be returned.
 * @api
 */
export class Connector {
  /**
   * Create the Connector class with a function that will take two
   * {@link module:saij/Connection~Connectable}s and create a key from them.
   * ```
   * const keyFunction = (conA, conB)=> `${conA.getName()}:${conB.getName()}`
   * const connector = new Connector(keyFunction);
   * const connection = connector.connect(conA, conB);
   * ```
   * @param  {function} keyFunction key creating function
   */
  constructor(keyFunction) {
    this.keyFn_ = keyFunction;
  }


  /**
   * Get the listeners keys for all the input/output listeners.
   * @param {module:saij/Connection~Connectable} conA connection A
   * @param {module:saij/Connection~Connectable} conB connection B
   * @return {module:saij/Connection~Connection} new connection
   * @api
   */
  connect(conA, conB) {
    return new Connection(
      this.keyFn_(conA, conB), conA, conB
    );
  }
}
