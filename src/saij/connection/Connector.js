/**
 * @module saij/connection/Connector
 */

import BaseObject from '../core/Object';
import AssertionError from '../core/AssertionError';
import Connection from './Connection';
import ConnectionType from './ConnectionType';
import Errors from '../core/Errors';


/* eslint max-len: 0 */


/**
 * A function to generate the connection key id.
 * @typedef {module:saij/connection/Connector~ConnectionKeyFunction} ConnectionKeyFunction
 * @api
 */


/**
 * @classdesc
 * A connector is a helper class, that you can instantiate with an id generating
 * function, that when `connect` is called between two
 * {@link module:saij/connection/Connection~Connectable}s, an id will be created
 * and a new {@link module:saij/connection/Connection~Connection} will be
 * returned.
 *
 * @api
 */
class Connector extends BaseObject {
  /**
   * Create the Connector class with a function that will take two
   * {@link module:saij/connection/Connection~Connectable}s and create a
   * key from them.
   * ```
   * const keyFunction = (conA, conB)=> `${conA.getName()}:${conB.getName()}`
   * const connector = new Connector(keyFunction, 'simplex');
   * const connection = connector.connect(conA, conB);
   * ```
   * @param  {module:saij/connection/Connector~ConnectionKeyFunction} keyFunction key string creating function
   * @param  {module:saij/connection/ConnectionType} opt_type optional connection type
   */
  constructor(keyFunction, opt_type) {
    super();

    if (!keyFunction) {
      throw new AssertionError(Errors.ASSERT_CON_KEY_FUNCTION.code);
    }

    this.type_ = opt_type ? opt_type : ConnectionType.SIMPLEX;
    this.keyFn_ = keyFunction;
  }


  /**
   * Create a new connection between two connectables, using the keyFunction
   * and type provided to generate a new connectionKey.
   * @param {module:saij/connection/Connection~Connectable} conA connection A
   * @param {module:saij/connection/Connection~Connectable} conB connection B
   * @return {module:saij/connection/Connection~Connection} new connection
   * @api
   */
  connect(conA, conB) {
    const id = this.keyFn_(conA, conB);
    const key = {id, type: this.type_};

    return new Connection(key, conA, conB);
  }
}

export default Connector;
