/**
 * @module saij/connection/ConnectionType
 */


/**
 * @enum {number}
 */
export default {
  /**
   * A one-way (simplex) connection where outputs from A -> B.
   * @type {module:saij/connection/Connection~Connection}
   * @api
   */
  SIMPLEX: 'simplex',
  /**
   * A two-way (duplex) connection where outputs from A -> B
   * and B -> A.
   * @type {module:saij/connection/Connection~Connection}
   * @api
   */
  DUPLEX: 'duplex',
  /**
   * A remote connection that publishes to a socket.
   * @type {module:saij/connection/Connection~Connection}
   * @api
   */
  REMOTE_SIMPLEX: 'remote_simplex',
  /**
   * A remote connection that publishes and subscribes to a
   * socket.
   * @type {module:saij/connection/Connection~Connection}
   * @api
   */
  REMOTE_DUPLEX: 'remote_duplex'
};
