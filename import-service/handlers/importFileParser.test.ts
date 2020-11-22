import { Context, S3Event, S3EventRecord } from 'aws-lambda';
import AWSMock from 'aws-sdk-mock';
import AWS from 'aws-sdk';

import { importFileParser } from './importFileParser';

const awsImportBucket = 'aws-import-s3';
const mockAwsInstance = jest.fn();

jest.mock('./constants', () => ({
  get s3() {
    return mockAwsInstance();
  },
  awsImportBucket,
}));

describe('importFileParser', () => {
  let event: S3Event;
  let _context: Context;
  let cb: jest.Mock;
  let error: Error;
  let Records: S3EventRecord[];
  let mockS3: AWS.S3;

  beforeEach(async () => {
    Records = ([
      { s3: { object: { key: 'uploaded/products.csv' } } },
    ] as unknown) as S3EventRecord[];
    event = ({ Records } as unknown) as S3Event;
    _context = { functionName: 'getProductById' } as Context;
    cb = jest.fn();

    AWSMock.setSDKInstance(AWS);
    AWSMock.mock('S3', 'getObject', (params: any, callback: Function) =>
      callback(error, { Body: 'mock products' })
    );
    AWSMock.mock('S3', 'copyObject', (params: any, callback: Function) =>
      callback(error, { CopyObjectResult: 'mock copy result' })
    );
    AWSMock.mock('S3', 'deleteObject', (params: any, callback: Function) => callback(error, {}));

    mockS3 = new AWS.S3({ region: 'eu-west-1' });
    mockAwsInstance.mockReturnValue(mockS3);
  });

  afterAll(() => {
    AWSMock.restore('S3');
  });

  it('should get an object from S3 by passed bucket name and a record key params', async () => {
    const getObjectSpy = jest.spyOn(mockS3, 'getObject');

    await importFileParser(event, _context, cb);

    expect(getObjectSpy).toHaveBeenCalledWith({
      Bucket: awsImportBucket,
      Key: Records[0].s3.object.key,
    });
  });

  it('should copy an object from S3 "uploaded" folder into "parsed" by passed bucket name, copy source and a parse path params', async () => {
    const copyObjectSpy = jest.spyOn(mockS3, 'copyObject');

    const copyPath = 'aws-import-s3/uploaded/products.csv';
    const parsePath = 'parsed/products.csv';

    await importFileParser(event, _context, cb);

    expect(copyObjectSpy).toHaveBeenCalledWith({
      Bucket: awsImportBucket,
      CopySource: copyPath,
      Key: parsePath,
    });
  });

  it('should remove an object from S3 "uploaded" folder after it was copied into "parsed" by passed bucket name and record key params', async () => {
    const deleteObjectSpy = jest.spyOn(mockS3, 'deleteObject');

    await importFileParser(event, _context, cb);

    expect(deleteObjectSpy).toHaveBeenCalledWith({
      Bucket: awsImportBucket,
      Key: Records[0].s3.object.key,
    });
  });
});
