
import BaseObject, {ObjectEvent} from './Object';


// eslint-disable-next-line max-statements
describe('BaseObject', ()=> {
  it('sets the object uid on initialisation', ()=> {
    const obj = new BaseObject();
    const obj2 = new BaseObject();

    expect(obj.saij_uid).toBe(1);
    expect(obj2.saij_uid).toBe(2);
  });

  it('can set and get get a value from a property key', ()=> {
    const obj = new BaseObject();

    obj.set('test', 'test-property');

    expect(obj.get('test')).toBe('test-property');
  });

  it('can set and get all the object properties', ()=> {
    const properties = {test: 'test-property', newProp: 'new-prop'};
    const obj = new BaseObject();

    obj.setProperties(properties);

    expect(obj.getProperties()).toEqual(properties);
  });

  it('can be initialised with properties from a props object', ()=> {
    const properties = {test: 'test-property', newProp: 'new-prop'};
    const obj = new BaseObject(properties);

    expect(obj.get('test')).toBe('test-property');
    expect(obj.get('newProp')).toBe('new-prop');
    expect(obj.getProperties()).toEqual(properties);
  });

  it('can unset a property key', ()=> {
    const properties = {test: 'test-property', newProp: 'new-prop'};
    const obj = new BaseObject(properties);

    obj.unset('test');

    expect(obj.getProperties()).toEqual({newProp: 'new-prop'});
    expect(obj.get('test')).toBe(undefined);
  });

  it('can get all the property keys on the object', ()=> {
    const properties = {test: 'test-property', newProp: 'new-prop'};
    const obj = new BaseObject(properties);

    expect(obj.getKeys()).toEqual(['test', 'newProp']);
  });

  it('can notify if a property key changes value', ()=> {
    const dispatch = jest.fn();
    const obj = new BaseObject();
    obj.dispatchEvent = dispatch;
    obj.set('test', 'test-property');

    expect(dispatch).toHaveBeenCalledWith(
      new ObjectEvent(undefined, 'test', undefined)
    );

    obj.set('test', 'new-test-property');

    expect(dispatch).toHaveBeenCalledWith(
      new ObjectEvent('change:test', 'test', 'test-property')
    );
  });

  it('can notify if a property key is unset', ()=> {
    const dispatch = jest.fn();
    const obj = new BaseObject();
    obj.set('test', 'test-property');

    obj.dispatchEvent = dispatch;
    obj.unset('test');

    expect(dispatch).toHaveBeenCalledWith(
      new ObjectEvent('change:test', 'test', 'test-property')
    );
  });

  it('can silently set a property value', ()=> {
    const dispatch = jest.fn();
    const obj = new BaseObject();
    obj.dispatchEvent = dispatch;
    obj.set('test', 'test-property', true);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('can silently unset a property value', ()=> {
    const dispatch = jest.fn();
    const obj = new BaseObject();
    obj.set('test', 'test-property');

    obj.dispatchEvent = dispatch;
    obj.unset('test', true);

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not notify if setting same value on property', ()=> {
    const obj = new BaseObject();
    obj.set('test', 'test-property');
    const dispatch = jest.fn();

    obj.set('test', 'test-property');

    expect(dispatch).not.toHaveBeenCalled();
  });

  it('does not notify if property key for unset is undefined', ()=> {
    const obj = new BaseObject();
    const dispatch = jest.fn();

    obj.unset('test', 'test-property');

    expect(dispatch).not.toHaveBeenCalled();
  });
});
