import { getAddProductsQueryValues } from './getAddProductsQueryValues';

describe('getAddProductsQueryValues', () => {
  it('should return a nested list with a list for each param', () => {
    const products = [
      {
        id: '1268154c-4f85-42b4-8114-04ecaf7e3626',
        title: 'The weekend in Cappadocia',
        description: 'Do you dream of a land',
        price: 1000,
        image_url: 'https://ulr/image1.jpg',
        count: 1,
      },
      {
        id: '66009e29-387f-498b-a876-6afca76d9d48',
        title: 'Erciyes ski New Year tour',
        description: 'Skiing is one of the best activity',
        price: 1500,
        image_url: 'https://ulr/image2.jpg',
        count: 7,
      },
    ];

    const queryValues = [
      ['The weekend in Cappadocia', 'Erciyes ski New Year tour'],
      ['Do you dream of a land', 'Skiing is one of the best activity'],
      [1000, 1500],
      ['https://ulr/image1.jpg', 'https://ulr/image2.jpg'],
      [1, 7],
    ];

    expect(getAddProductsQueryValues(products)).toEqual(queryValues);
  });
});
