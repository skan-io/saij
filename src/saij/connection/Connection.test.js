import BaseObject from '../core/Object';
import AssertionError from '../core/AssertionError';
import Connection, {assertConnectable} from './Connection';
import ConnectionType from './ConnectionType';


const createConnectable = (inProps, outProps)=> {
  const input = new BaseObject(inProps);
  const output = new BaseObject(outProps);
  const mockConnectable = new BaseObject();
  mockConnectable.getInput = jest.fn(()=> input);
  mockConnectable.getOutput = jest.fn(()=> output);
  mockConnectable.getName = jest.fn(()=> 'test-name');
  return mockConnectable;
};


describe('Connectable Assertion', ()=> {
  it('returns false if object undefined', ()=> {
    const obj = undefined;

    expect(assertConnectable(obj)).toBe(false);
  });

  it('returns false if no getInput function', ()=> {
    const obj = {getOutput: ()=> null};

    expect(assertConnectable(obj)).toBe(false);
  });

  it('returns false if not getOutput function', ()=> {
    const obj = {getInput: ()=> null};

    expect(assertConnectable(obj)).toBe(false);
  });

  it('returns false if BaseObject not returned from getInput', ()=> {
    const obj = {getInput: ()=> null, getOutput: ()=> new BaseObject()};

    expect(assertConnectable(obj)).toBe(false);
  });

  it('returns false if BaseObject not returned from getOutput', ()=> {
    const obj = {getInput: ()=> new BaseObject(), getOutput: ()=> null};

    expect(assertConnectable(obj)).toBe(false);
  });

  it('returns true if functions exist and return BaseObject', ()=> {
    const obj = {
      getInput: ()=> new BaseObject(), getOutput: ()=> new BaseObject()
    };

    expect(assertConnectable(obj)).toBe(true);
  });
});


describe('Connection - Errors', ()=> {
  it('throws if no parameters provided', ()=> {
    expect(()=> {
      const connection = new Connection();
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if no connection key provided', ()=> {
    expect(()=> {
      const connection = new Connection(
        undefined, createConnectable(), createConnectable()
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if connection key provided without id string', ()=> {
    expect(()=> {
      const connectionKey = {type: 'test-type'};
      const connection = new Connection(
        connectionKey, createConnectable(), createConnectable()
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if connection key provided without type string', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id'};
      const connection = new Connection(
        connectionKey, createConnectable(), createConnectable()
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if connection key provided with incompatible type string', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id', type: 'unknown-type'};
      const connection = new Connection(
        connectionKey, createConnectable(), createConnectable()
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if set the key with incompatible type string', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id', type: ConnectionType.SIMPLEX};
      const connection = new Connection(
        connectionKey, createConnectable(), createConnectable()
      );
      connection.setKey({...connectionKey, type: 'unknown-type'});
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if source not connectable', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id', type: ConnectionType.SIMPLEX};
      const connection = new Connection(
        connectionKey, undefined, createConnectable()
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if destination not connectable', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id', type: ConnectionType.SIMPLEX};
      const connection = new Connection(
        connectionKey, createConnectable(), undefined
      );
      return connection;
    }).toThrow(AssertionError);
  });

  it('does not throw if correct params passed', ()=> {
    expect(()=> {
      const connectionKey = {id: 'test-id', type: ConnectionType.SIMPLEX};
      const connection = new Connection(
        connectionKey, createConnectable(), createConnectable()
      );
      return connection;
    }).not.toThrow(AssertionError);
  });
});

describe('Connection - Simplex/Duplex', ()=> {
  it('can connect a simplex connection', ()=> {
    const conA = createConnectable(undefined, {match: true});
    const conB = createConnectable({match: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(1);
    expect(connection.isConnected()).toBe(true);
    expect(connection.isListening()).toBe(true);

    expect(conA.getOutput).toHaveBeenCalled();
    expect(conB.getInput).toHaveBeenCalled();
  });

  // eslint-disable-next-line max-statements
  it('can connect a duplex connection', ()=> {
    const conA = createConnectable({avail: true}, {match: true});
    const conB = createConnectable({match: true}, {avail: true});
    const key = {id: 'test-id', type: ConnectionType.DUPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(2);
    expect(connection.isConnected()).toBe(true);
    expect(connection.isListening()).toBe(true);

    expect(conA.getInput).toHaveBeenCalled();
    expect(conA.getOutput).toHaveBeenCalled();
    expect(conB.getInput).toHaveBeenCalled();
    expect(conB.getOutput).toHaveBeenCalled();
  });

  it('can disconnect a simplex connection', ()=> {
    const conA = createConnectable(undefined, {match: true});
    const conB = createConnectable({match: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(1);

    connection.disconnect();

    expect(connection.getListeners().getArray().length).toBe(0);
    expect(connection.isConnected()).toBe(false);
    expect(connection.isListening()).toBe(false);
  });

  it('can disconnect a duplex connection', ()=> {
    const conA = createConnectable({avail: true}, {match: true});
    const conB = createConnectable({match: true}, {avail: true});
    const key = {id: 'test-id', type: ConnectionType.DUPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(2);

    connection.disconnect();

    expect(connection.getListeners().getArray().length).toBe(0);
    expect(connection.isConnected()).toBe(false);
    expect(connection.isListening()).toBe(false);
  });

  // eslint-disable-next-line max-statements
  it('does not connect if already connected', ()=> {
    const conA = createConnectable(undefined, {match: true});
    const conB = createConnectable({match: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};
    // Connect automatically on construction if it can
    const connection = new Connection(key, conA, conB);

    expect(connection.isConnected()).toBe(true);
    expect(connection.getListeners().getArray().length).toBe(1);

    const listener1 = connection.getListeners().getArray()[0];
    connection.connect();

    expect(connection.isConnected()).toBe(true);
    expect(connection.getListeners().getArray().length).toBe(1);

    const listener2 = connection.getListeners().getArray()[0];

    expect(listener1).toEqual(listener2);
  });
});


describe('Connection - Listeners', ()=> {
  it('can be connected without having listeners', ()=> {
    const conA = createConnectable();
    const conB = createConnectable();
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(0);
    expect(connection.isConnected()).toBe(true);
    expect(connection.isListening()).toBe(false);
  });

  it('will only connect matching props', ()=> {
    const conA = createConnectable(undefined, {propA: true, propB: true});
    const conB = createConnectable({propB: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};

    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(1);
    expect(connection.isConnected()).toBe(true);
    expect(connection.isListening()).toBe(true);
  });

  it('will pass data between connected props', ()=> {
    const conA = createConnectable(undefined, {propA: true, propB: true});
    const conB = createConnectable({propB: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};
    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(1);

    conA.getOutput().set('propB', false);

    expect(conB.getInput().get('propB')).toBe(false);
  });
});


describe('Connection - Keys', ()=> {
  // eslint-disable-next-line max-statements
  it('will reconnect if the key type has changed', ()=> {
    const conA = createConnectable(undefined, {match: true});
    const conB = createConnectable({match: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};
    const connection = new Connection(key, conA, conB);

    expect(connection.getListeners().getArray().length).toBe(1);

    const listener1 = connection.getListeners().getArray()[0];
    const set = connection.setKey({...key, type: ConnectionType.DUPLEX});
    const listener2 = connection.getListeners().getArray()[0];

    expect(set).toBe(true);
    expect(connection.getListeners().getArray().length).toBe(1);
    expect(listener1).not.toEqual(listener2);
  });

  it('can get the connection key', ()=> {
    const conA = createConnectable(undefined, {match: true});
    const conB = createConnectable({match: true}, undefined);
    const key = {id: 'test-id', type: ConnectionType.SIMPLEX};
    const connection = new Connection(key, conA, conB);

    const key2 = connection.getKey();

    expect(key2.id).toBe(key.id);
    expect(key2.type).toBe(key.type);
  });
});
