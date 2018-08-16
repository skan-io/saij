/**
 * @module saij/Organ
 */

import BaseObject from './core/Object';
import Collection from './core/Collection';
import AssertionError from './core/AssertionError';
import Errors from './core/Errors';


/**
 * @classdesc
 * The saij Organ will contain layers that will be piped together to create
 * an analytical or response system.
 * @api
 */
class Organ extends BaseObject {
  constructor(name, opt_layers, opt_siblings) {
    super();

    this.name_ = name;

    if (typeof this.name_ !== 'string') {
      throw new AssertionError(Errors.ASSERT_ORGAN_NAME.code);
    }

    this.layers_ = opt_layers ? new Collection(opt_layers) : new Collection();
    this.siblings_ = opt_siblings
      ? new Collection(opt_siblings) : new Collection();

    this.input_ = new BaseObject();
    this.output_ = new BaseObject();
  }

  setLayers(layers) {
    this.layers_.clear();

    for (const layer of layers) {
      this.layers_.push(layer);
    }
  }

  getLayers() {
    return this.layers_;
  }

  /**
   * Set the organ name.
   * @param {string} name organ name
   * @api
   */
  setName(name) {
    if (typeof name === 'string') {
      this.name_ = name;
    }
  }

  /**
   * Get the organ name.
   * @return {string} organ name
   * @api
   */
  getName() {
    return this.name_;
  }
}

export default Organ;
