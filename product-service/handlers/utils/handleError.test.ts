import { handleError } from './handleError';

describe('handleError', () => {
  it('should respond with not found status code and error message', () => {
    const message = 'Error message';

    const response = {
      statusCode: 500,
      body: JSON.stringify(message),
    };

    expect(handleError(message)).toEqual(response);
  });
});
