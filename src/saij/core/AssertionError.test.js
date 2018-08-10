
import AssertionError from './AssertionError';


const randomErrorCode = 9;
const message =
  'Assertion failed. See https://docs.saij.io/latest/errors/#9 for details.';

describe('AssertionError', ()=> {
  it('creates an Error with code and message pointing to docs', ()=> {
    const assertionError = new AssertionError(randomErrorCode);

    expect(assertionError.code).toBe(randomErrorCode);
    expect(assertionError.message).toBe(message);
  });
});
