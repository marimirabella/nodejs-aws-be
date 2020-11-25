import { defaultImgUrl } from '../constants';
import { parseProducts } from './parseProducts';

describe('parseProduct', () => {
  it('should return a parsed product', () => {
    const products = [
      {
        title: 'Trip 1',
        description: 'desc',
        price: '1000',
        image_url: 'url-1',
        count: '6',
      },
      {
        title: 'Trip 2',
        description: 'desc',
        price: '2000',
        image_url: '',
        count: '12',
      },
    ];

    const parsedProducts = [
      {
        title: 'Trip 1',
        description: 'desc',
        price: 1000,
        image_url: 'url-1',
        count: 6,
      },
      {
        title: 'Trip 2',
        description: 'desc',
        price: 2000,
        image_url: defaultImgUrl,
        count: 12,
      },
    ];

    expect(parseProducts(products)).toEqual(parsedProducts);
  });
});
