import sinon from 'sinon';
import {listen, listenOnce, bindListener} from './events';
import {unlisten, unlistenAll, unlistenByKey} from './events';
import {findListener, getListeners} from './events';
import EventTarget from '../Target';


/* eslint no-empty-function: 0 */


// eslint-disable-next-line max-statements
describe('Saij events', ()=> {
  let add = null;
  let remove = null;
  let target = null;

  beforeEach(()=> {
    add = sinon.spy();
    remove = sinon.spy();
    target = {
      addEventListener: add,
      removeEventListener: remove
    };
  });

  describe('Binding listeners', ()=> {
    it('binds a listener and returns a bound listener function', ()=> {
      const listenerObj = {
        listener: sinon.spy(),
        bindTo: {id: 1}
      };

      const boundListener = bindListener(listenerObj);

      expect(listenerObj.boundListener).toEqual(boundListener);
      boundListener();
      expect(listenerObj.listener.thisValues[0]).toEqual(listenerObj.bindTo);
    });

    it('binds to the target when bindTo is not provided', ()=> {
      const listenerObj = {
        listener: sinon.spy(),
        target: {id: 1}
      };

      const boundListener = bindListener(listenerObj);

      expect(listenerObj.boundListener).toEqual(boundListener);
      boundListener();
      expect(listenerObj.listener.thisValues[0]).toEqual(listenerObj.target);
    });

    // eslint-disable-next-line prefer-arrow-callback
    it('binds a self-unregistering listener when callOnce is true', function() {
      const bindTo = {id: 1};
      const listenerObj = {
        type: 'foo',
        target,
        bindTo,
        callOnce: true
      };
      listenerObj.listener = function() {
        expect(this).toEqual(bindTo);
      };

      const boundListener = bindListener(listenerObj);

      expect(listenerObj.boundListener).toEqual(boundListener);
      boundListener();
    });
  });

  describe('Finding listeners', ()=> {
    let listener = null;
    let listenerObj = null;
    let listeners = null;

    beforeEach(()=> {

      listener = ()=> {};
      listenerObj = {
        type: 'foo',
        target,
        listener
      };
      listeners = [listenerObj];
    });

    it('searches a listener array for a specific listener', ()=> {
      const bindTo = {id: 1};

      let result = findListener(listeners, listener);
      expect(result).toEqual(listenerObj);

      result = findListener(listeners, listener, bindTo);
      expect(result).toBe(undefined);

      listenerObj.bindTo = bindTo;
      result = findListener(listeners, listener);
      expect(result).toBe(undefined);

      result = findListener(listeners, listener, bindTo);
      expect(result).toBe(listenerObj);
    });

    it('marks the delete index on a listener object', ()=> {
      const result = findListener(listeners, listener, undefined, true);
      expect(result).toBe(listenerObj);
      expect(listenerObj.deleteIndex).toBe(0);
    });
  });


  describe('Getting listeners', ()=> {
    it('returns listeners for a target and type', ()=> {
      const foo = listen(target, 'foo', ()=> {});
      const bar = listen(target, 'bar', ()=> {});

      expect(getListeners(target, 'foo')).toEqual([foo]);
      expect(getListeners(target, 'bar')).toEqual([bar]);
    });

    it('returns undefined when no listeners are registered', ()=> {
      expect(getListeners(target, 'foo')).toBe(undefined);
    });
  });


  describe('Listen', ()=> {
    it('calls addEventListener on the target', ()=> {
      listen(target, 'foo', ()=> {});

      expect(add.callCount).toBe(1);
    });

    it('returns a key', ()=> {
      const key = listen(target, 'foo', ()=> {});

      expect(key).toBeInstanceOf(Object);
    });

    it('does not add the same listener twice', ()=> {
      const listener = ()=> {};

      const key1 = listen(target, 'foo', listener);
      const key2 = listen(target, 'foo', listener);

      expect(key1).toEqual(key2);
      expect(add.callCount).toBe(1);
    });

    it('only treats listeners as same when all args are equal', ()=> {
      const listener = ()=> {};

      listen(target, 'foo', listener, {});
      listen(target, 'foo', listener, {});
      listen(target, 'foo', listener, undefined);

      // eslint-disable-next-line no-magic-numbers
      expect(add.callCount).toBe(3);
    });
  });


  describe('Listen Once', ()=> {
    it('creates a one-off listener', ()=> {
      const listener = sinon.spy();
      const key = listenOnce(target, 'foo', listener);

      expect(add.callCount).toBe(1);
      expect(key.callOnce).toBe(true);

      key.boundListener();

      expect(listener.callCount).toBe(1);
      expect(remove.callCount).toBe(1);
    });

    it('does not add the same listener twice', ()=> {
      const listener = ()=> {};

      const key1 = listenOnce(target, 'foo', listener);
      const key2 = listenOnce(target, 'foo', listener);

      expect(key1).toEqual(key2);
      expect(add.callCount).toBe(1);
      expect(key1.callOnce).toBe(true);
    });

    it('listen can turn a one-off listener into a permanent one', ()=> {
      const listener = sinon.spy();
      let key = listenOnce(target, 'foo', listener);

      expect(key.callOnce).toBe(true);

      key = listen(target, 'foo', listener);

      expect(add.callCount).toBe(1);
      expect(key.callOnce).toBe(false);

      key.boundListener();

      expect(remove.callCount).toBe(0);
    });
  });


  describe('Unlisten', ()=> {
    it('unregisters previously registered listeners', ()=> {
      const listener = ()=> {};

      listen(target, 'foo', listener);
      unlisten(target, 'foo', listener);

      expect(getListeners(target, 'foo')).toBe(undefined);
    });

    it('works with multiple types', ()=> {
      const listener = ()=> {};

      listen(target, ['foo', 'bar'], listener);
      unlisten(target, ['bar', 'foo'], listener);

      expect(getListeners(target, 'foo')).toBe(undefined);
      expect(getListeners(target, 'bar')).toBe(undefined);
    });
  });

  describe('unlistenByKey', ()=> {
    it('unregisters previously registered listeners', ()=> {
      const key = listen(target, 'foo', ()=> {});

      unlistenByKey(key);

      expect(getListeners(target, 'foo')).toBe(undefined);
    });

    it('works with multiple types', ()=> {
      const key = listen(target, ['foo', 'bar'], ()=> {});

      unlistenByKey(key);

      expect(getListeners(target, 'foo')).toBe(undefined);
      expect(getListeners(target, 'bar')).toBe(undefined);
    });
  });


  describe('Unlisten All', ()=> {
    it('unregisters all listeners registered for a target', ()=> {
      const keys = [
        listen(target, 'foo', ()=> {}),
        listen(target, 'bar', ()=> {})
      ];

      unlistenAll(target);

      expect(getListeners(target, 'foo')).toBe(undefined);
      expect(getListeners(target, 'bar')).toBe(undefined);
      expect('saij_lm' in target).toBe(false);
      expect(keys).toEqual([{}, {}]);
    });
  });


  describe('Compatibility with saij.EventTarget', ()=> {
    it('does not register duplicated listeners', ()=> {
      target = new EventTarget();
      const listener = ()=> {};

      const key1 = listen(target, 'foo', listener);

      expect(target.getListeners('foo')).toEqual([key1.boundListener]);

      const key2 = listen(target, 'foo', listener);

      expect(key2.boundListener).toEqual(key1.boundListener);
      expect(target.getListeners('foo')).toEqual([key1.boundListener]);
    });

    it('registers multiple listeners if this object is different', ()=> {
      target = new EventTarget();
      const listener = ()=> {};

      const key1 = listen(target, 'foo', listener, {});
      const key2 = listen(target, 'foo', listener, {});

      expect(key1.boundListener).not.toEqual(key2.boundListener);
      expect(target.getListeners('foo')).toEqual(
        [key1.boundListener, key2.boundListener]);
    });
  });
});
