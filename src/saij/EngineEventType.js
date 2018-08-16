/**
 * @module saij/core/EngineEventType
 */

/**
 * @enum {string}
 */
export default {
  /**
   * Triggered if the engine is set to use a clock
   * @event module:saij/Engine~EngineEvent#tick
   * @api
   */
  TICK: 'tick',
  /**
   * Triggered when the engine has output
   * @event module:saij/Engine~EngineEvent#data
   * @api
   */
  DATA: 'data'
};
