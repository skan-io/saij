import BaseObject from './core/Object';
import AssertionError from './core/AssertionError';
import Connection from './Connection';
import {Connector} from './Connection';


const createConnectable = ()=> {
  const mockConnectable = new BaseObject();
  mockConnectable.getInput = jest.fn(()=> new BaseObject());
  mockConnectable.getOutput = jest.fn(()=> new BaseObject());
  mockConnectable.getName = jest.fn(()=> 'test-name');
  return mockConnectable;
};


// eslint-disable-next-line max-statements
describe('Connection', ()=> {
  let inputA = null;
  let outputA = null;
  let outputASpy = null;
  let inputB = null;
  let outputB = null;
  let outputBSpy = null;
  let connectableA = null;
  let connectableB = null;

  // eslint-disable-next-line max-statements
  beforeEach(()=> {
    inputA = new BaseObject({propA: null, dudProp: null});
    outputA = new BaseObject({propB: null});
    inputB = new BaseObject({propB: null, dudProp: null});
    outputB = new BaseObject({propA: null});

    outputASpy = jest.spyOn(outputA, 'on');
    outputBSpy = jest.spyOn(outputB, 'on');

    connectableA = new BaseObject();
    connectableA.getInput = jest.fn(()=> inputA);
    connectableA.getOutput = jest.fn(()=> outputA);
    connectableA.getName = jest.fn(()=> 'test-name-A');
    connectableB = new BaseObject();
    connectableB.getInput = jest.fn(()=> inputB);
    connectableB.getOutput = jest.fn(()=> outputB);
    connectableB.getName = jest.fn(()=> 'test-name-B');
  });

  it('throws if no key provided on construction', ()=> {
    expect(()=> {
      const connection = new Connection();
      return connection;
    }).toThrow(AssertionError);
  });

  it('throws if no connection A or B provided on construction', ()=> {
    expect(()=> {
      const connection = new Connection('test-key');
      return connection;
    }).toThrow(TypeError);

    expect(()=> {
      const connection = new Connection('test-key', createConnectable());
      return connection;
    }).toThrow(TypeError);

    expect(()=> {
      const connection = new Connection(
        'test-key', undefined, createConnectable()
      );
      return connection;
    }).toThrow(TypeError);
  });

  it('sets the key on construction', ()=> {
    const conA = createConnectable();
    const conB = createConnectable();
    const connection = new Connection('test-key', conA, conB);

    expect(connection.getKey()).toBe('test-key');
  });

  it('can set the connection key', ()=> {
    const conA = createConnectable();
    const conB = createConnectable();
    const connection = new Connection('test-key', conA, conB);

    connection.setKey('new-key');

    expect(connection.getKey()).toBe('new-key');
  });

  it('wont set the key unless a string is passed', ()=> {
    const conA = createConnectable();
    const conB = createConnectable();
    const connection = new Connection('test-key', conA, conB);

    connection.setKey({myKey: 'test-key'});

    expect(connection.getKey()).toBe('test-key');
  });

  it('sets private variables on construction', ()=> {
    const conA = createConnectable();
    const conB = createConnectable();
    const connection = new Connection('test-key', conA, conB);

    expect(connection.cons_).toEqual([conA, conB]);
    expect(connection.conA_).toEqual(conA);
    expect(connection.conB_).toEqual(conB);
  });

  it('sets up the listeners on input and output', ()=> {
    // eslint-disable-next-line
    const connection = new Connection('test-key', connectableA, connectableB);

    expect(connectableA.getInput).toHaveBeenCalled();
    expect(connectableB.getInput).toHaveBeenCalled();
    expect(connectableA.getOutput).toHaveBeenCalled();
    expect(connectableB.getOutput).toHaveBeenCalled();
    expect(outputASpy).toHaveBeenCalled();
    expect(outputBSpy).toHaveBeenCalled();
  });

  it('sets up the listeners on input and output', ()=> {
    // eslint-disable-next-line
    const connection = new Connection('test-key', connectableA, connectableB);

    expect(connectableA.getInput).toHaveBeenCalled();
    expect(connectableB.getInput).toHaveBeenCalled();
    expect(connectableA.getOutput).toHaveBeenCalled();
    expect(connectableB.getOutput).toHaveBeenCalled();
    expect(outputASpy).toHaveBeenCalled();
    expect(outputBSpy).toHaveBeenCalled();
  });

  it('can get the listeners', ()=> {
    const connection = new Connection('test-key', connectableA, connectableB);
    expect(connection.getListeners().getArray().length).toBe(2);
  });

  it('sets corresponding input on output change', ()=> {
    // eslint-disable-next-line
    const connection = new Connection('test-key', connectableA, connectableB);

    outputA.set('propB', 'new-value');
    outputB.set('propA', 'new-value-2');

    expect(inputB.get('propB')).toBe('new-value');
    expect(inputA.get('propA')).toBe('new-value-2');
  });

  it('can disconnect the connection', ()=> {
    const connection = new Connection('test-key', connectableA, connectableB);

    expect(connection.getListeners().getArray().length).toBe(2);

    connection.disconnect();

    expect(connection.getListeners().getArray().length).toBe(0);
  });

  it('can tell if the connection is connected', ()=> {
    const connection = new Connection('test-key', connectableA, connectableB);

    expect(connection.isConnected()).toBe(true);

    connection.disconnect();

    expect(connection.isConnected()).toBe(false);
  });
});


describe('Connector', ()=> {
  it('will throw if no key function supplied', ()=> {
    const connector = new Connector();

    expect(()=> {
      connector.connect(createConnectable(), createConnectable());
    }).toThrow(TypeError);
  });

  it('can create a new connection with key from key function', ()=> {
    const keyFunction = ()=> 'test-key';
    const connector = new Connector(keyFunction);

    const connection = connector.connect(
      createConnectable(), createConnectable()
    );

    expect(connection.getKey()).toBe('test-key');
  });
});
