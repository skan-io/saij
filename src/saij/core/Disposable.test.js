
import Disposable from './Disposable';
import {VOID} from './utils/functions.js';


jest.mock('./utils/functions.js', ()=> ({
  VOID: jest.fn()
}));


describe('Disposable', ()=> {
  it('contains a dispose member function', ()=> {
    const disposable = new Disposable();

    expect(typeof disposable.dispose).toBe('function');
  });

  it('runs void function when dispose called', ()=> {
    const disposable = new Disposable();
    disposable.dispose();

    expect(VOID).toHaveBeenCalled();
    expect(disposable.disposed_).toBe(true);
  });

  it('does not run void function if already disposed', ()=> {
    const disposable = new Disposable();
    disposable.disposed_ = true;
    disposable.dispose();

    expect(VOID).not.toHaveBeenCalled();
  });
});
