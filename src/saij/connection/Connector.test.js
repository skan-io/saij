import BaseObject from '../core/Object';
import AssertionError from '../core/AssertionError';
import Connector from './Connector';
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


describe('Connector', ()=> {
  it('will throw if no key function supplied', ()=> {
    expect(()=> {
      const connector = new Connector();
      return connector;
    }).toThrow(AssertionError);
  });

  it('can create a new connection with key from key function', ()=> {
    const keyFunction = ()=> 'test-key';
    const connector = new Connector(keyFunction);

    const connection = connector.connect(
      createConnectable(), createConnectable()
    );

    expect(connection.getKey().id).toBe('test-key');
    expect(connection.getKey().type).toBe(ConnectionType.SIMPLEX);
  });

  it('can be passed a connection type', ()=> {
    const keyFunction = ()=> 'test-key';
    const connector = new Connector(keyFunction, ConnectionType.DUPLEX);

    const connection = connector.connect(
      createConnectable(), createConnectable()
    );

    expect(connection.getKey().id).toBe('test-key');
    expect(connection.getKey().type).toBe(ConnectionType.DUPLEX);
  });
});
