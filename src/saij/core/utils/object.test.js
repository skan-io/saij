import {assign, clear, isEmpty, getValues} from './object';


describe('Object utils', ()=> {
  it('is an alias for Object.assign() where available', ()=> {
    if (typeof Object.assign === 'function') {
      expect(assign).toEqual(Object.assign);
    }
  });

  it('assigns properties from a source object to a target object', ()=> {
    const source = {
      sourceProp1: 'sourceValue1',
      sourceProp2: 'sourceValue2'
    };
    const target = {
      sourceProp1: 'overridden',
      targetProp1: 'targetValue1'
    };

    const assigned = assign(target, source);

    expect(assigned).toBe(target);
    expect(assigned.sourceProp1).toBe('sourceValue1');
    expect(assigned.sourceProp2).toBe('sourceValue2');
    expect(assigned.targetProp1).toBe('targetValue1');

  });

  it('throws a TypeError with `undefined` as target', ()=> {
    expect(()=> assign(undefined)).toThrow(TypeError);
  });

  it('throws a TypeError with `null` as target', ()=> {
    expect(()=> assign(null)).toThrow(TypeError);
  });

  it('removes all properties from an object with clear', ()=> {
    expect(isEmpty(clear({foo: 'bar'}))).toBe(true);
    expect(isEmpty(clear({foo: 'bar', num: 42}))).toBe(true);
    expect(isEmpty(clear({}))).toBe(true);
    expect(isEmpty(clear(null))).toBe(true);
  });

  it('getValues gets a list of property values from an object', ()=> {
    // eslint-disable-next-line no-magic-numbers
    expect(getValues({foo: 'bar', num: 42}).sort()).toEqual([42, 'bar']);
    expect(getValues(null)).toEqual([]);
  });

  it('isEmpty checks if an object has any properties', ()=> {
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty({foo: 'bar'})).toBe(false);
    expect(isEmpty({foo: false})).toBe(false);
  });
});
