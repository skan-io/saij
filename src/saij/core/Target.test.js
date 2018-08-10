
import Target from './Target';
import Event from './Event';
import {listen} from './utils/events';


describe('Target', ()=> {
  it('can add event new listeners', ()=> {
    const target = new Target();

    const listener = ()=> null;
    const listenerObj = ({
      bindTo: target,
      callOnce: false,
      listener,
      target,
      type: 'test-event'
    });

    target.addEventListener('test-event', listenerObj);

    expect(target.getListeners('test-event')).toEqual([listenerObj]);
  });

  it("won't duplicate listeners", ()=> {
    const target = new Target();

    const listener = ()=> null;
    const listenerObj = ({
      bindTo: target,
      callOnce: false,
      listener,
      target,
      type: 'test-event'
    });

    target.addEventListener('test-event', listenerObj);
    target.addEventListener('test-event', listenerObj);

    expect(target.getListeners('test-event')).toEqual([listenerObj]);
  });

  it('has listeners for each registered type', ()=> {
    const target = new Target();
    const cb1 = ()=> null;
    const cb2 = ()=> null;

    target.addEventListener('test-event', cb1);
    target.addEventListener('test-event2', cb2);

    expect(target.hasListener('test-event')).toBe(true);
    expect(target.hasListener('test-event2')).toBe(true);
  });

  it('reports any listeners when called without argument', ()=> {
    const target = new Target();

    expect(target.hasListener()).toBe(false);

    target.listeners_['test-event'] = [()=> null];

    expect(target.hasListener()).toBe(true);
  });

  it('reports listeners for the type passed as argument', ()=> {
    const target = new Target();

    target.listeners_['test-event'] = [()=> null];

    expect(target.hasListener('test-event')).toBe(true);
    expect(target.hasListener('test-event2')).toBe(false);
  });
});


describe('Target - Dispatch Events', ()=> {
  it('can dispatch events', ()=> {
    const target = new Target();
    const cb = jest.fn();

    listen(target, 'test-event', cb);
    target.dispatchEvent('test-event');

    expect(cb).toHaveBeenCalled();
  });

  it('calls event listeners in correct order', ()=> {
    const target = new Target();
    const called = [];
    const cb1 = jest.fn(()=> called.push(1));
    const cb2 = jest.fn(()=> called.push(2));

    target.addEventListener('test-event', cb1);
    target.addEventListener('test-event', cb2);

    target.dispatchEvent('test-event');

    expect(called).toEqual([1, 2]);
  });

  it('stops propagation when listeners return false', ()=> {
    const target = new Target();
    const called = [];
    const cb1 = ()=> called.push(1);
    const cb2 = ()=> {
      called.push(2);
      return false;
    };
    // eslint-disable-next-line no-magic-numbers
    const cb3 = ()=> called.push(3);

    target.addEventListener('test-event', cb1);
    target.addEventListener('test-event', cb2);
    target.addEventListener('test-event', cb3);
    target.dispatchEvent('test-event');

    expect(called).toEqual([1, 2]);
  });

  it('stops propagation when listeners call preventDefault', ()=> {
    const target = new Target();
    const called = [];
    const cb1 = ()=> called.push(1);
    const cb2 = (evt)=> {
      called.push(2);
      evt.preventDefault();
    };
    // eslint-disable-next-line no-magic-numbers
    const cb3 = ()=> called.push(3);

    target.addEventListener('test-event', cb1);
    target.addEventListener('test-event', cb2);
    target.addEventListener('test-event', cb3);
    target.dispatchEvent('test-event');

    expect(called).toEqual([1, 2]);
  });

  it('passes a default saij/core/Event object to listeners', ()=> {
    const target = new Target();
    const events = [];
    const cb = (evt)=> events.push(evt);

    target.addEventListener('test-event', cb);
    target.dispatchEvent('test-event');

    expect(events[0]).toBeInstanceOf(Event);
    expect(events[0].type).toBe('test-event');
    expect(events[0].target).toEqual(target);
  });

  it('passes a custom event object with target to listeners', ()=> {
    const target = new Target();
    const events = [];
    const cb = (evt)=> events.push(evt);
    const event = {type: 'test-event'};

    target.addEventListener('test-event', cb);
    target.dispatchEvent(event);

    expect(events[0]).toEqual(event);
    expect(events[0].target).toEqual(target);
  });
});


describe('Target - Listeners', ()=> {
  // eslint-disable-next-line max-statements
  it('can remove event listeners from within listeners', ()=> {
    const target = new Target();
    const called = [];
    const cb1 = ()=> called.push(1);
    const cb2 = ()=> called.push(2);
    // eslint-disable-next-line no-magic-numbers
    const cb3 = ()=> called.push(3);
    const cbRemove = ()=> {
      target.removeEventListener('test-event', cb1);
      target.removeEventListener('test-event', cb2);
      target.removeEventListener('test-event', cb3);
    };

    target.addEventListener('test-event', cb1);
    target.addEventListener('test-event', cbRemove);
    target.addEventListener('test-event', cb3);
    target.addEventListener('test-event', cb2);

    expect(()=> target.dispatchEvent('test-event')).not.toThrow();
    expect(called).toEqual([1]);
    expect(target.getListeners('test-event').length).toBe(1);
  });

  it('can handle removal if listener does not exist', ()=> {
    const target = new Target();
    const cb = ()=> null;

    expect(()=> target.removeEventListener('test-event', cb)).not.toThrow();
  });

  // eslint-disable-next-line max-statements
  it('can handle calling circular calls from within listeners', ()=> {
    const target = new Target();
    const called = [];
    const cb1 = ()=> called.push(1);
    const cb2 = ()=> called.push(2);
    const cbCircular = (evt)=> {
      target.removeEventListener('test-event', cbCircular);
      target.removeEventListener('test-event', cb1);
      target.dispatchEvent('test-event');
      target.removeEventListener('test-event', cb2);
      target.dispatchEvent('test-event');
      evt.preventDefault();
    };

    target.addEventListener('test-event', cb2);
    target.addEventListener('test-event', cbCircular);
    target.addEventListener('test-event', cb1);

    expect(()=> target.dispatchEvent('test-event')).not.toThrow();
    expect(called).toEqual([2, 2]);
    expect(target.getListeners('test-event')).toBe(undefined);
  });
});


describe('Target - Dispose', ()=> {
  it('cleans up foreign references', ()=> {
    const target = new Target();
    const cb = ()=> null;
    const document = {};
    listen(target, 'test-event', cb, document);

    expect(target.hasListener('test-event')).toBe(true);

    target.dispose();

    expect(target.hasListener('test-event')).toBe(false);
  });
});
