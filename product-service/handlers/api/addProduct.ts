import { APIGatewayProxyHandler } from 'aws-lambda';

import { ProductService } from '../../services/product';
import { createResponse, handleError } from '../utils';

const Product = new ProductService();

export const addProduct: APIGatewayProxyHandler = async ({ body }) => {
  try {
    console.log('create product request', body);

    const product = await Product.createProduct(JSON.parse(body!));

    return createResponse({
      statusCode: 201,
      body: product,
    });
  } catch (err) {
    return handleError(err);
  }
};
