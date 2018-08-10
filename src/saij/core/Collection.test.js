
import Collection, {CollectionEvent} from './Collection';
import CollectionEventType from './CollectionEventType';
import AssertionError from './AssertionError';

/* eslint no-magic-numbers: 0 */

// eslint-disable-next-line max-statements
describe('Collection', ()=> {
  it('can be initialised without any parameters', ()=> {
    const collection = new Collection();

    expect(collection.getArray()).toEqual([]);
  });

  it('can be initialised with an array containing any type', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.getArray()).toEqual(array);
  });

  it('can be initialised with disallow unique option', ()=> {
    const array = [1, 2, 3, 4, 5];
    const uniqueOnly = true;
    const collection = new Collection(array, {unique: uniqueOnly});

    expect(collection.unique_).toBe(true);
  });

  it('can clear the collection array', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.getArray()).toEqual(array);

    collection.clear();

    expect(collection.getArray()).toEqual([]);
  });

  it('can be extended with another array', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.getArray()).toEqual(array);
    const extension = [6, 7, 8];
    collection.extend(extension);

    expect(collection.getArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8]);
  });

  it('can run for-each callback on each element', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    collection.forEach((elem, idx, arr)=> {
      arr[idx] = elem + 1;
    });

    expect(collection.getArray()).toEqual([2, 3, 4, 5, 6]);
  });

  it('can get an item at a given index', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.item(1)).toBe(2);
  });

  it('can get its length', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.getLength()).toBe(5);
  });

  it('can insert an item at a given index', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    collection.insertAt(3, 4);

    expect(collection.getArray()).toEqual([1, 2, 3, 4, 4, 5]);
  });

  it('can pop the last item', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.pop()).toBe(5);
    expect(collection.getArray()).toEqual([1, 2, 3, 4]);
  });

  it('can remove a given element', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    expect(collection.remove(5)).toBe(5);
    expect(collection.getArray()).toEqual([1, 2, 3, 4]);
  });

  it('can set an item at a given index', ()=> {
    const array = [1, 2, 3, 4, 5];
    const collection = new Collection(array);

    collection.setAt(2, 4);

    expect(collection.getArray()).toEqual([1, 2, 4, 4, 5]);
  });

  it('returns undefined if cannot find element to remove', ()=> {
    const collection = new Collection();

    const removed = collection.remove(1);

    expect(removed).toBe(undefined);
  });

  it('setAt works if given index greater than array length', ()=> {
    const array = [1, 2, 3];
    const collection = new Collection(array);

    collection.setAt(5, 4);

    expect(collection.getArray()).toEqual([1, 2, 3, undefined, undefined, 4]);
  });
});


describe('Collection Errors', ()=> {
  it('throws AssertionError if setAt called with non-unique', ()=> {
    const array = [1, 2, 3];
    const uniqueOnly = true;
    const collection = new Collection(array, {unique: uniqueOnly});

    expect(()=> collection.setAt(2, 1)).toThrow(AssertionError);
  });

  it('throws AssertionError if insertAt called with non-unique', ()=> {
    const array = [1, 2, 3];
    const uniqueOnly = true;
    const collection = new Collection(array, {unique: uniqueOnly});

    expect(()=> collection.insertAt(2, 1)).toThrow(AssertionError);
  });

  it('throws AssertionError if push called with non-unique', ()=> {
    const array = [1, 2, 3];
    const uniqueOnly = true;
    const collection = new Collection(array, {unique: uniqueOnly});

    expect(()=> collection.push(1)).toThrow(AssertionError);
  });
});


// eslint-disable-next-line max-statements
describe('Collection - Events', ()=> {
  let collection = null;
  let dispatch = null;
  beforeEach(()=> {
    dispatch = jest.fn();
    collection = new Collection([1, 2, 3, 4]);
    collection.dispatchEvent = dispatch;
  });

  it('dispatches add event with extend', ()=> {
    collection.extend([1]);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.ADD, 1)
    );
  });

  it('dispatches add event with insertAt', ()=> {
    collection.insertAt(0, 1);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.ADD, 1)
    );
  });

  it('dispatches add event with push', ()=> {
    collection.push(1);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.ADD, 1)
    );
  });

  it('dispatches add event with setAt', ()=> {
    collection.setAt(0, 1);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.ADD, 1)
    );
  });

  it('dispatches remove event with clear', ()=> {
    collection.clear(0);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.REMOVE, 1)
    );
  });

  it('dispatches remove event with pop', ()=> {
    collection.pop();

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.REMOVE, 4)
    );
  });

  it('dispatches remove event with remove', ()=> {
    collection.remove(1);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.REMOVE, 1)
    );
  });

  it('dispatches remove event with removeAt', ()=> {
    collection.removeAt(0);

    expect(dispatch).toHaveBeenCalledWith(
      new CollectionEvent(CollectionEventType.REMOVE, 1)
    );
  });
});
