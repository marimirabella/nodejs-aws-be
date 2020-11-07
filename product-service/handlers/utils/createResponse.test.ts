import { createResponse } from './createResponse';

describe('createResponse', () => {
  it('should create response with a status code, headers and body', () => {
    const params = {
      statusCode: 200,
      body: {
        title: 'title',
      },
    };

    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(params.body),
    };

    expect(createResponse(params)).toEqual(response);
  });
});
