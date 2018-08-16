/**
 * // Thought? should this be abstracted away further
 * and referred to as an OrganicEngine, leaving room
 * for a PipelineEngine
 * @module saij/Engine
 */

import BaseObject from './core/Object';
import Collection from './core/Collection';
import CollectionEventType from './core/CollectionEventType';
import {unByKey} from './core/Observable';
import {Connector} from './Connection';


// The key will always be <bigger UID>:<smaller UID>
const getOrganConnectionKey = (organA, organB)=> (
  organA.getUid() > organB.getUid() ?
    `${organA.getUid()}:${organB.getUid()}`
    : `${organB.getUid()}:${organA.getUid()}`
);


// Will create connections between organs
// organConnector.connect(organA, organB);
const organConnector = new Connector(getOrganConnectionKey);


/**
 * @classdesc
 * The saij Engine is the coordinator of all the organs.  Using this
 * architecture the organs themselves will have their own brains, and they
 * are interconnected by the engine.
 *
 * The engine can be used with a clock to signify a rhythm in the data flow,
 * or it will default to asynchronous delivery of data.
 * @api
 */
class Engine extends BaseObject {
  /**
   * // TODO session, attention, clock
   * @param {session} session the contextual session of the engine
   * @param {attention} attention attention model to use with the organ signals
   * //
   * @param {rhythm} rhythm rythm of the data, async or not?
   *  await on all inputs or not? etc
   * @param {Array<module:saij/Organ>=} opt_organs Options organs array.
   */
  // TODO
  // Throw noConnection option? for if an organ should have a connection
  // and doesnt
  // Debug option?
  // Clock option?
  constructor(opt_organs) {
    super();

    this.organs_ = opt_organs ? new Collection(opt_organs) : new Collection();

    this.organMapId_ = new Map();
    this.organMapName_ = new Map();
    this.connections_ = new Map();

    this.initialise_();
    this.initialiseHandlers_();
  }

  initialise_() {
    // Populate organ mappings
    for (const organ of this.organs_.getArray()) {
      // No duplicate organ names
      if (!this.findOrgan(organ.getName())) {
        this.setOrganMaps_(organ);
      }
    }

    // Iterate over each organ and connect it to all others,
    // if a connection is required
    for (const organ of this.organs_.getArray()) {
      for (const name of organ.siblings().getArray()) {
        // Connection is some sort of name or id
        const organFound = this.findOrgan(name);

        if (organFound) {
          // Sets the connection between the two organs
          this.updateConnection(organ, organFound);
        }
      }
    }
  }

  /**
   * Set up the add and remove events on the organs collection
   * @private
   */
  initialiseHandlers_() {
    // Add event
    this.organs_.on(CollectionEventType.ADD, (evt)=> {
      const organ = evt.element;
      this.setOrganMaps_(organ);
      // Set the connection between this organ and all others
      for (const otherOrgan of this.organs_.getArray()) {
        this.updateConnection(organ, otherOrgan);
      }
    });

    this.organs_.on(CollectionEventType.REMOVE, (evt)=> {
      const organ = evt.element;
      this.removeOrganMaps_(organ);
      for (const otherOrgan of this.organs_.getArray()) {
        this.removeConnectionBetween(organ, otherOrgan);
      }
    });
  }

  /**
   * Add the organ to the organ id and name maps
   * @param {module:saij/Organ} organ organ to set
   * @private
   */
  setOrganMaps_(organ) {
    this.organMapId_.set(organ.getUid(), organ);
    this.organMapName_.set(organ.getName(), organ);
  }

  /**
   * Remove the organ from the id and name maps
   * @param {module:saij/Organ} organ organ to set
   * @private
   */
  removeOrganMaps_(organ) {
    if (this.organMapId_.get(organ.getUid())) {
      this.organMapId_.delete(organ.getUid());
    }
    if (this.organMapName_.get(organ.getName())) {
      this.organMapName_.delete(organ.getName());
    }
  }

  /*
    Connection: {
      key,
      listeners: <Collection of listener keys> for use with unByKey
    }
   */
  /**
   * Update the connection between two organs.  This will reset
   * the inputs and outputs listeners on each.
   * @param {module:saij/Organ} organA first organ
   * @param {module:saij/Organ} organB second organ
   * @api
   */
  updateConnection(organA, organB) {
    // If the organ isnt in the engine, we dont want to add extra connections
    if (!this.findOrgan(organA.getUid()) || !this.findOrgan(organB.getUid())) {
      return;
    }

    const key = getOrganConnectionKey(organA, organB);
    // Connection class object
    const connection = this.connections_.get(key);

    if (connection) {
      connection.disconnect();
    }

    this.connections_.set(key, organConnector.connect(organA, organB));
  }

  /**
   * Get all the connections between organs held by the engine.
   * @return {Array<module:saij/Connection>}
   * @api
   */
  getConnections() {
    return [...this.connections_.values()];
  }

  /**
   * Get the connection with the given key
   * @param {string} key connection key
   * @return {module:saij/Connection}
   * @api
   */
  getConnectionByKey(key) {
    return this.connections_.get(key);
  }

  /**
   * Remove a given connection
   * @param {module:saij/Connection} connection connection to remove
   * @api
   */
  removeConnection(connection) {
    const key = connection.key;
    if (key) {
      this.removeConnectionByKey(connection.key);
    }
  }

  /**
   * Remove the connection with the given key
   * @param {string} key organ connection key
   * @api
   */
  removeConnectionByKey(key) {
    const found = this.connections_.get(key);
    if (found) {
      unByKey(found.listeners);
      this.connections_.delete(key);
    }
  }

  /**
   * Remove the connection between two organs
   * @param {module:saij/Organ} organA first organ
   * @param {module:saij/Organ} organB second organ
   * @api
   */
  removeConnectionBetween(organA, organB) {
    const key = getOrganConnectionKey(organA, organB);
    this.removeConnectionByKey(key);
  }

  /**
   * Add a new organ to the engine
   * @param {module:saij/Organ}
   * @api
   */
  addOrgan(organ) {
    if (!this.findOrgan(organ.getName())) {
      this.organs_.push(organ);
    }
  }

  /**
   * Remove an organ from the engine
   * @param {module:saij/Organ}
   * @api
   */
  removeOrgan(organ) {
    if (this.findOrgan(organ)) {
      this.organs_.remove(organ);
    }
  }

  /**
   * Remove the organ with the given id
   * @param {string}
   * @api
   */
  removeOrganById(id) {
    const organ = this.organMapId_.get(id);
    if (organ) {
      this.organs_.remove(organ);
    }
  }

  /**
   * Remove the organ with the given name
   * @param {string}
   * @api
   */
  removeOrganByName(name) {
    const organ = this.organMapName_.get(name);
    if (organ) {
      this.organs_.remove(organ);
    }
  }

  /**
   * Return an organ with either it's name or id as the passed
   * identifying string, or return undefined.
   * @param {string} identifer name or unique id of the organ
   * @return {module:saij/Organ|undefined}
   * @api
   */
  findOrgan(identifer) {
    const id = this.organMapId_.get(identifer);
    const name = this.organMapName_.get(identifer);

    return id ? id : name;
  }

  /**
   * Get the engine organs.
   * @return {module:saij/core/Collection<module:saij/Organ>}
   * @api
   */
  getOrgans() {
    return this.organs_;
  }

  /**
   * Set the engine organs.
   * @param {Array<module:saij/Organ>}
   * @api
   */
  setOrgans(organs) {
    this.organs_.clear();
    for (const organ of organs) {
      if (!this.findOrgan(organ)) {
        this.organs_.push(organ);
      }
    }
  }

  /**
   * Set the engine output target. // TODO
   * @param {HTML}
   * @api
   */
  setTarget(elem) {
    this.element_ = elem;
  }

  /**
   * Format the output. // TODO
   * @param {function}
   * @api
   */
  formatOutput(fmtFunc) {
    this.formatFunction_ = fmtFunc;
  }
}

export default Engine;
