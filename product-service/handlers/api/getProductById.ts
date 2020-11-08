import { APIGatewayProxyHandler } from 'aws-lambda';

import { ProductService } from '../../services/product';
import { createResponse, handleError } from '../utils';

const Product = new ProductService();

export const getProductById: APIGatewayProxyHandler = async ({ pathParameters }) => {
  try {
    console.log('get product by id request', pathParameters?.productId);

    const product = await Product.getProductById(pathParameters?.productId!);

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
  } catch (err) {
    return handleError(err);
  }
};
