import {TRUE, FALSE, VOID} from './functions';


/* eslint new-cap: 0 */

describe('Basic functions', ()=> {
  it('returns correct value', ()=> {
    expect(TRUE()).toBe(true);
    expect(FALSE()).toBe(false);
    expect(VOID()).toBe(undefined);
  });
});
