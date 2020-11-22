import { APIGatewayProxyHandler } from 'aws-lambda';

import { createResponse, handleError } from './utils';
import { awsImportBucket, s3 } from './constants';

export const importProductsFile: APIGatewayProxyHandler = async ({ queryStringParameters }) => {
  const fileName = queryStringParameters?.name;
  const catalogPath = `uploaded/${fileName}`;

  const params = {
    Bucket: awsImportBucket,
    Key: catalogPath,
    Expires: 60,
    ContentType: 'text/csv',
  };

  try {
    const url = await s3.getSignedUrlPromise('putObject', params);

    return createResponse({
      statusCode: 200,
      body: url,
    });
  } catch (err) {
    return handleError(err);
  }
};
