
import Observable, {unByKey} from './Observable';
import EventType from './EventType';
import {listen, unlistenByKey, unlisten, listenOnce} from './utils/events.js';


jest.mock('./utils/events.js', ()=> ({
  listen: jest.fn(),
  unlistenByKey: jest.fn(),
  unlisten: jest.fn(),
  listenOnce: jest.fn()
}));


describe('Observable', ()=> {
  it('is initialised with a revision counter of 0', ()=> {
    const obs = new Observable();

    expect(obs.getRevision()).toBe(0);
  });

  it('dispatches a general change event on change', ()=> {
    const obs = new Observable();
    const dispatch = jest.fn();
    obs.dispatchEvent = dispatch;

    obs.changed();

    expect(dispatch).toHaveBeenCalledWith(EventType.CHANGE);
  });

  it('sets listeners for single event type', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.on('new-event', cb);

    expect(listen).toHaveBeenCalledWith(obs, 'new-event', cb);
  });

  it('sets listeners for array of event types', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.on(['new-event-1', 'new-event-2'], cb);

    expect(listen.mock.calls[0][0]).toEqual(obs);
    expect(listen.mock.calls[0][1]).toBe('new-event-1');
    expect(listen.mock.calls[0][2]).toEqual(cb);
    expect(listen.mock.calls[1][0]).toEqual(obs);
    expect(listen.mock.calls[1][1]).toBe('new-event-2');
    expect(listen.mock.calls[1][2]).toEqual(cb);
  });

  it('sets listenOnce for single event type', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.once('new-event', cb);

    expect(listenOnce).toHaveBeenCalledWith(obs, 'new-event', cb);
  });

  it('sets listenOnce for array of event types', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.once(['new-event-1', 'new-event-2'], cb);

    expect(listenOnce.mock.calls[0][0]).toEqual(obs);
    expect(listenOnce.mock.calls[0][1]).toBe('new-event-1');
    expect(listenOnce.mock.calls[0][2]).toEqual(cb);
    expect(listenOnce.mock.calls[1][0]).toEqual(obs);
    expect(listenOnce.mock.calls[1][1]).toBe('new-event-2');
    expect(listenOnce.mock.calls[1][2]).toEqual(cb);
  });

  it('unsets listeners for single event type', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.un('new-event', cb);

    expect(unlisten).toHaveBeenCalledWith(obs, 'new-event', cb);
  });

  it('unsets listeners for array of event types', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    obs.un(['new-event-1', 'new-event-2'], cb);

    expect(unlisten.mock.calls[0][0]).toEqual(obs);
    expect(unlisten.mock.calls[0][1]).toBe('new-event-1');
    expect(unlisten.mock.calls[0][2]).toEqual(cb);
    expect(unlisten.mock.calls[1][0]).toEqual(obs);
    expect(unlisten.mock.calls[1][1]).toBe('new-event-2');
    expect(unlisten.mock.calls[1][2]).toEqual(cb);
  });

  it('can unset listeners using single key from on or once functions', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    const key = obs.on('new-event', cb);
    unByKey(key);

    expect(unlistenByKey).toHaveBeenCalledWith(key);
  });

  it('can unset listeners using array of keys from on or once functions', ()=> {
    const obs = new Observable();
    const cb = ()=> null;

    const keys = obs.on(['new-event-1', 'new-event-2'], cb);
    unByKey(keys);

    expect(unlistenByKey.mock.calls[0][0]).toEqual(keys[0]);
    expect(unlistenByKey.mock.calls[1][0]).toEqual(keys[1]);
  });
});
