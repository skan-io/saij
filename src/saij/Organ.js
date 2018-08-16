import BaseObject from './core/Obejct';
import Collection from '.core/Collection';

/* eslint camelcase: 0 */
/* eslint no-underscore-dangle: 0 */

class Organ extends BaseObject {
  constructor(opt_layerGroups) {
    super();

    // Layer groups are async layer chunks
    //
    // Layers will be processed sequentially,
    // while layer groups will processed in parallel
    //
    // This applies to all `Groups`
    this.layerGroups_ = opt_layerGroups
      ? new Collection(opt_layerGroups) : new Collection();

    this.input_ = new BaseObject();
    this.output_ = new BaseObject();

    this.listeners_ = new Collection();

    this.setLayerGroupOutput(this.output_);
    this.pipeData_();
  }


  // Needed to be regarded as "connectable"
  getInput() {
    return this.input_;
  }

  // Needed to be regarded as "connectable"
  getOutput() {
    return this.output_;
  }

  // Get the layer group collection
  getLayerGroups() {
    return this.layerGroups_();
  }

  // Push data into the async layerGroup pipes
  // @private
  pipeData_() {
    for (const layerGroup of this.layerGroups_.getArray()) {
      // Whenever a prop on the input changes, inject the newly updated input
      // object into the layerGroup
      this.listeners_.push(this.input_.on('propertychange', ()=> {
        layerGroup.inject(this.input_);
      }));
    }
  }
}

export default Organ;
