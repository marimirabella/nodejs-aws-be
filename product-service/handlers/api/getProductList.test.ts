import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { Product } from '../../data-access';
import { ProductService } from '../../services/product';
import { getProductList } from './getProductList';

jest.mock('../../services/product');

describe('getProductList', () => {
  let event: APIGatewayProxyEvent;
  let _context: Context;
  let cb: jest.Mock;
  let products: Product[];

  beforeEach(() => {
    event = { body: 'body' } as APIGatewayProxyEvent;
    _context = { functionName: 'getProductList' } as Context;
    cb = jest.fn();

    products = [
      {
        id: 'id-1',
        title: 'title-1',
        description: 'description-1',
        price: 1000,
        image_url: 'https://image-url-1/',
        count: 13,
      },
      {
        id: 'id-2',
        title: 'title-2',
        description: 'description-2',
        price: 1000,
        image_url: 'https://image-url-2/',
        count: 20,
      },
    ];

    (ProductService.prototype.getProducts as jest.Mock).mockResolvedValue(products);
  });

  it('should respond with a product when products exist', async () => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(products),
    };

    expect(await getProductList(event, _context, cb)).toEqual(response);
  });

  it('should respond with message when products do not exist', async () => {
    (ProductService.prototype.getProducts as jest.Mock).mockResolvedValue([]);

    const response = {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Products not found' }),
    };

    expect(await getProductList(event, _context, cb)).toEqual(response);
  });

  it('should respond with error message on error', async () => {
    (ProductService.prototype.getProducts as jest.Mock).mockRejectedValue(new Error('Error'));

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error: Error') };

    expect(await getProductList(event, _context, cb)).toEqual(response);
  });
});
