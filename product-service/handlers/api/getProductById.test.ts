import { APIGatewayProxyEvent, Context } from 'aws-lambda';

import { Product } from '../../data-access';
import { ProductService } from '../../services/product';
import { getProductById } from './getProductById';

jest.mock('../../services/product');

describe('getProductById', () => {
  let event: APIGatewayProxyEvent;
  let _context: Context;
  let cb: jest.Mock;
  let product: Product;
  let productList: Product[];

  beforeEach(() => {
    event = ({
      pathParameters: { productId: '5802483b-16e5-4347-a648-1bead3529489' },
    } as unknown) as APIGatewayProxyEvent;
    _context = { functionName: 'getProductById' } as Context;
    cb = jest.fn();

    product = {
      id: '5802483b-16e5-4347-a648-1bead3529489',
      title: 'title',
      description: 'description',
      price: 1000,
      image_url: 'https://image-url/',
      count: 10,
    };

    const product2 = { ...product, id: 'e47aa487-3050-4e76-a40c-726056ba8b88' };

    productList = [product, product2];

    (ProductService.prototype.getProductById as jest.Mock).mockResolvedValue(productList.find(product => product.id === event.pathParameters!.productId));

  });

  it('should respond with a product when the product was found', async () => {
    const response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify(product),
    };

    expect(await getProductById(event, _context, cb)).toEqual(response);
  });

  it('should respond with message when product was not found', async () => {
    (ProductService.prototype.getProductById as jest.Mock).mockResolvedValue(undefined);

    const response = {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true,
      },
      body: JSON.stringify({ message: 'Product not found' }),
    };

    expect(await getProductById(event, _context, cb)).toEqual(response);
  });

  it('should respond with error message on error', async () => {
    (ProductService.prototype.getProductById as jest.Mock).mockRejectedValue(new Error('Error'));

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error: Error') };

    expect(await getProductById(event, _context, cb)).toEqual(response);
  });
});
