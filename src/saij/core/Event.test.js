
import Event from './Event';
import {stopPropagation, preventDefault} from './Event';


describe('Event', ()=> {
  it('is initialised with a string type', ()=> {
    const type = 'Test Event Type';
    const event = new Event(type);

    expect(event.type).toBe('Test Event Type');
    expect(event.target).toBe(null);
  });

  it('can call preventDefault itself', ()=> {
    const type = 'Test Event Type';
    const event = new Event(type);

    expect(event.propagationStopped).toBe(false);

    event.preventDefault();

    expect(event.propagationStopped).toBe(true);
  });

  it('can call stopPropagation on itself', ()=> {
    const type = 'Test Event Type';
    const event = new Event(type);

    expect(event.propagationStopped).toBe(false);

    event.stopPropagation();

    expect(event.propagationStopped).toBe(true);
  });

  it('can have preventDefault called with it', ()=> {
    const type = 'Test Event Type';
    const event = new Event(type);

    expect(event.propagationStopped).toBe(false);

    preventDefault(event);

    expect(event.propagationStopped).toBe(true);
  });

  it('can have stopPropagation called with it', ()=> {
    const type = 'Test Event Type';
    const event = new Event(type);

    expect(event.propagationStopped).toBe(false);

    stopPropagation(event);

    expect(event.propagationStopped).toBe(true);
  });
});
