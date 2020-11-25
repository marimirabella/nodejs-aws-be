import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { ProductWithStock, ProductWithStockBody } from '../../data-access';
import { ProductService } from '../../services/product';
import { addProduct } from './addProduct';

jest.mock('../../services/product');

describe('addProduct', () => {
  let event: APIGatewayProxyEvent;
  let _context: Context;
  let cb: jest.Mock;
  let productBody: ProductWithStockBody;
  let product: ProductWithStock;

  beforeEach(() => {
    productBody = {
      title: 'title',
      description: 'description',
      price: 1000,
      image_url: 'https://image-url/',
      count: 10,
    };
    event = ({
      body: JSON.stringify(productBody),
    } as unknown) as APIGatewayProxyEvent;
    _context = { functionName: 'addProduct' } as Context;
    cb = jest.fn();

    product = {
      id: '5802483b-16e5-4347-a648-1bead3529489',
      ...productBody
    } as ProductWithStock;

    (ProductService.prototype.createProduct as jest.Mock).mockResolvedValue(product);
  });

  it('should respond with a product when the product was created', async () => {
    const response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };

    expect(await addProduct(event, _context, cb)).toEqual(response);
  });

  it('should respond with error message on error', async () => {
    (ProductService.prototype.createProduct as jest.Mock).mockRejectedValue(new Error('Error'));

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error: Error') };

    expect(await addProduct(event, _context, cb)).toEqual(response);
  });
});
