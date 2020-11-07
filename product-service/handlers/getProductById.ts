import { APIGatewayProxyHandler } from 'aws-lambda';

import { createResponse, getMockProductFromDbById, handleError } from './utils';

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  try {
    const product = await getMockProductFromDbById(pathParameters?.productId!);

    if (product) {
      return createResponse({
        statusCode: 200,
        body: product,
      });
    }

    return createResponse({
      statusCode: 404,
      body: { message: 'Product not found' },
    });
  } catch {
    return handleError('Unhandled error');
  }
};
