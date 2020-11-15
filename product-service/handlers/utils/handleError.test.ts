import { handleError, ValidationErrors } from './handleError';

describe('handleError', () => {
  it('should respond with bad request status code and validation error message on validation error', () => {
    const error = {
      code: ValidationErrors.uniqueViolation,
      message: 'invalid input syntax for type integer',
    };

    const response = {
      statusCode: 400,
      body: JSON.stringify(`Validation error: ${error.message}`),
    };

    expect(handleError(error)).toEqual(response);
  });

  it('should respond with internal server error code and error message', () => {
    const error = {
      code: 2323,
      message: 'Something went wrong',
    };

    const response = {
      statusCode: 500,
      body: JSON.stringify(`Unhandled error: ${error.message}`),
    };

    expect(handleError(error)).toEqual(response);
  });
});
