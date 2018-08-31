
import AssertionError from './AssertionError';


const randomErrorCode = 9;
const message =
  '[UNKOWN ERROR] - The error code supplied is unknown. Assertion failed. See https://skan-io.github.io/saij/module-saij_core_Errors for details. Version: 1.0.2';

describe('AssertionError', ()=> {
  it('creates an Error with code and message pointing to docs', ()=> {
    const assertionError = new AssertionError(randomErrorCode);

    expect(assertionError.code).toBe(randomErrorCode);
    expect(assertionError.message).toBe(message);
  });
});
