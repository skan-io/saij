import BaseObject from './core/Object';
import Collection from './core/Collection';
import {Connector} from './Connection';


/* eslint no-underscore-dangle: 0 */

const groupConnectionKey = (itemA, itemB)=> (
  itemA.getUid() > itemB.getUid()
    ? `${itemA.getUid()}:${itemB.getUid()}`
    : `${itemB.getUid()}:${itemA.getUid()}`
);

const groupItemConnector = new Connector(groupConnectionKey);


// Items must be 'Groupable', meaning that they must all
// contain async 'pipe()' functions that will run that items
// data flow
class Group extends BaseObject {
  constructor(items) {
    super();

    this.connections_ = new Collection();
    this.setItems(items);

    // To make a group connectable
    this.createJunctions_();
  }

  // We want to create an input and out object with all the props
  // from all the items' inputs and outputs
  createJunctions_() {
    this.inputJunction_ = new BaseObject();
    this.outputJunction_ = new BaseObject();

    for (const item of this.items_.getArray()) {
      this.inputJunction_.setProperties({
        ...this.inputJunction_.getProperties(),
        ...item.getInput().getProperties()
      });
      this.outputJunction_.setProperties({
        ...this.outputJunction_.getProperties(),
        ...item.getOutput().getProperties()
      });
    }

    // On input change, the new data object
    this.inputJunction_.on('propertychange', ()=> {
      this.inject(this.inputJunction_);
    });
  }

  // Make a group 'Connectable'
  getInput() {
    return this.inputJunction_;
  }

  // When we call getInput or getOutput we are actually getting a junction
  // of all the items' inputs and outputs, which will then forward the input
  // or output to the items pipe
  getOutput() {
    return this.outputJunction_;
  }

  // Can be used to 'insertAt' or 'push' new items onto the pipe.
  getItems() {
    return this.items_;
  }

  // Set the group items, must be ordered, unique and must be groupable
  setItems(items) {
    if (Array.isArray(items)) {
      // A group must contain unique items
      // Order matters! Uniqueness matters!
      this.items_ = new Collection(items, {unique: true});
    } else if (items instanceof Collection) {
      this.items_ = items;
    } else {
      this.items_ = new Collection(undefined, {unique: true});
    }
  }

  // This will take the collection of 'Groupable' items and will
  // sequentially pipe the data into each item.  The passed data
  // object is untouched, while anew dataObj object is mutated
  // through the pipe.  Thus the pipe must in some way mutate the
  // dataObj.
  async inject(data) {
    const props = data.getProperties();
    const dataObj = new BaseObject(props);

    for (const item of this.items_.getArray()) {
      await item.pipe(dataObj);
    }

    // This will alert the outputJunction of the processed output
    this.outputJunction_.setProperties({
      ...this.outputJunction_.getProperties(),
      ...dataObj.getProperties()
    });
  }
}

export default Group;
