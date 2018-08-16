import Engine from './Engine';


describe('Engine', ()=> {
  it('can be intialised with no parameters', ()=> {
    expect(()=> new Engine()).not.toThrow();
  });
});
