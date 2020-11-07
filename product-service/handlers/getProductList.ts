import { APIGatewayProxyHandler } from 'aws-lambda';

import { createResponse, handleError, getMockProductsFromDb } from './utils';

export const getProductList: APIGatewayProxyHandler = async () => {
  try {
    const products = await getMockProductsFromDb();

    if (products) {
      return createResponse({
        statusCode: 200,
        body: products,
      });
    }

    return createResponse({
      statusCode: 404,
      body: { message: 'Products not found' },
    });
  } catch {
    return handleError('Unhandled error');
  }
};
