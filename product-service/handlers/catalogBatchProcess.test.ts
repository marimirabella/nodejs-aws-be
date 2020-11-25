import { Context, SQSEvent } from 'aws-lambda';

import { ProductWithStock, ProductWithStockBody } from '../data-access';
import { publishSns } from './utils/publishSns';
import { ProductService } from '../services/product';
import { catalogBatchProcess } from './catalogBatchProcess';

jest.mock('../services/product');
jest.mock('./utils/publishSns');

describe('catalogBatchProcess', () => {
  let event: SQSEvent;
  let _context: Context;
  let cb: jest.Mock;
  let productsBody: ProductWithStockBody[];
  let products: ProductWithStock[];

  beforeEach(() => {
    productsBody = ([
      {
        title: 'title-1',
        description: 'description',
        price: '1000',
        image_url: 'https://image-url-1/',
        count: '10',
      },
      {
        title: 'title-2',
        description: 'description',
        price: '2000',
        image_url: 'https://image-url-2/',
        count: '20',
      },
    ] as unknown) as ProductWithStockBody[];

    event = ({
      Records: [
        { body: JSON.stringify(productsBody[0]) },
        { body: JSON.stringify(productsBody[1]) },
      ],
    } as unknown) as SQSEvent;
    _context = { functionName: 'catalogBatchProcess' } as Context;
    cb = jest.fn();

    products = [
      {
        id: 'id-1',
        title: 'title-1',
        description: 'description-1',
        price: 500,
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

    (ProductService.prototype.createProducts as jest.Mock).mockResolvedValue(products);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should add new products on catalog batch process', async () => {
    await catalogBatchProcess(event, _context, cb);

    expect(ProductService.prototype.createProducts).toHaveBeenCalledWith(productsBody);
  });

  it('should send a message to an amazon sns topic via email about successful product creation for budget and expensive products', async () => {
    await catalogBatchProcess(event, _context, cb);

    expect(publishSns).toHaveBeenCalledWith(products);
  });

  it('should NOT send a message to an amazon sns topic via email about successful product creation when products were not created', async () => {
    (ProductService.prototype.createProducts as jest.Mock).mockResolvedValue([]);

    await catalogBatchProcess(event, _context, cb);

    expect(publishSns).not.toHaveBeenCalledWith(products);
  });
});
