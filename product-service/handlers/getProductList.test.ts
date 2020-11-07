import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getMockProductsFromDb } from './utils/getFakeDbItems';
import { Product } from './typings';
import { getProductList } from './getProductList';

jest.mock('./utils/getFakeDbItems');

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
        imageUrl: 'https://image-url-1/'
      },
      {
        id: 'id-2',
        title: 'title-2',
        description: 'description-2',
        price: 1000,
        imageUrl: 'https://image-url-2/'
      },
    ];

    (getMockProductsFromDb as jest.Mock).mockResolvedValue(products);
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
    (getMockProductsFromDb as jest.Mock).mockResolvedValue(undefined);

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
    (getMockProductsFromDb as jest.Mock).mockRejectedValue(new Error('Error'));

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error') };

    expect(await getProductList(event, _context, cb)).toEqual(response);
  });
});
