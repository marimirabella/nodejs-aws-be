import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

import { importProductsFile } from './importProductsFile';

const mockAwsInstance = jest.fn();
jest.mock('./constants', () => ({
  get s3() {
    return mockAwsInstance();
  },
  awsImportBucket: 'aws-import-s3',
}));

describe('importProductsFile', () => {
  let event: APIGatewayProxyEvent;
  let _context: Context;
  let cb: jest.Mock;
  let error: Error;
  let url: string;

  beforeEach(async () => {
    event = ({
      queryStringParameters: { name: 'products.csv' },
    } as unknown) as APIGatewayProxyEvent;
    _context = { functionName: 'getProductById' } as Context;
    cb = jest.fn();
    url =
      'https://aws-import-s3.s3.eu-west-1.amazonaws.com/uploaded/products.csv?AWSAccessKeyId=AKIAZNV62MIVSXO7CYLT&Expires=1605370581&Signature=DlDQVlBOjpdETLXAnNG7MVHMQ0c%3D';

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getSignedUrl', (method: string, params: any, callback: Function) =>
      callback(error, url)
    );

    mockAwsInstance.mockReturnValue(new AWS.S3({ region: 'eu-west-1' }));
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  it('should respond wih ok status code and pre-signed url', async () => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(url),
    };

    expect(await importProductsFile(event, _context, cb)).toEqual(response);
  });

  it('should respond with error message on import error', async () => {
    error = new Error('Error');

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error: Error') };

    expect(await importProductsFile(event, _context, cb)).toEqual(response);
  });
});
