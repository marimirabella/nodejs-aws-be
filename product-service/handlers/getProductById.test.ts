import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { getMockProductFromDbById } from './utils/getFakeDbItems';
import { Product } from './typings';
import { getProductById } from './getProductById';

jest.mock('./utils/getFakeDbItems');

describe('getProductById', () => {
  let event: APIGatewayProxyEvent;
  let _context: Context;
  let cb: jest.Mock;
  let product: Product;
  let productList: Product[];

  beforeEach(() => {
    event = ({ pathParameters: { productId: '3' } } as unknown) as APIGatewayProxyEvent;
    _context = { functionName: 'getProductById' } as Context;
    cb = jest.fn();

    product = {
      id: '3',
      title: 'title',
      description: 'description',
      price: 1000,
      imageUrl: 'https://image-url/',
    };

    const product2 = { ...product, id: '4' };

    productList = [product, product2];

    (getMockProductFromDbById as jest.Mock).mockImplementation(() =>
      productList.find(product => product.id === event.pathParameters!.productId)
    );
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
    (getMockProductFromDbById as jest.Mock).mockResolvedValue(undefined);

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
    (getMockProductFromDbById as jest.Mock).mockRejectedValue(new Error('Error'));

    const response = { statusCode: 500, body: JSON.stringify('Unhandled error') };

    expect(await getProductById(event, _context, cb)).toEqual(response);
  });
});
