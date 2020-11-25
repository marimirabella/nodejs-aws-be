import { getAddStockQueryValues } from './getAddStockQueryValues';

describe('getAddStockQueryValues', () => {
  it('should return a nested list with a list for each param with random stock value', () => {
    Math.floor = jest.fn().mockReturnValue(1);

    const productIds = [
      { id: '1268154c-4f85-42b4-8114-04ecaf7e3626' },
      { id: '66009e29-387f-498b-a876-6afca76d9d48' },
    ];

    const queryValues = [
      ['1268154c-4f85-42b4-8114-04ecaf7e3626', '66009e29-387f-498b-a876-6afca76d9d48'],
      [1, 1],
    ];

    expect(getAddStockQueryValues(productIds)).toEqual(queryValues);
  });
});
