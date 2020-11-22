import { handleError } from './handleError';

describe('handleError', () => {
  it('should respond with internal server error status code and error message', () => {
    const error = {
      message: 'Something went wrong',
    };

    const response = {
      statusCode: 500,
      body: JSON.stringify(`Unhandled error: ${error.message}`),
    };

    expect(handleError(error)).toEqual(response);
  });
});
