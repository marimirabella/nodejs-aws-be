import { APIGatewayProxyHandler } from 'aws-lambda';

import { ProductService } from '../../services/product';
import { createResponse, handleError } from '../utils';

const Product = new ProductService();

export const getProductList: APIGatewayProxyHandler = async () => {
  try {
    console.log('get products request');

    const products = await Product.getProducts();

    if (products.length) {
      return createResponse({
        statusCode: 200,
        body: products,
      });
    }

    return createResponse({
      statusCode: 404,
      body: { message: 'Products not found' },
    });
  } catch (err) {
    return handleError(err);
  }
};
