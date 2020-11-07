import { Product } from '../typings';
import productList from './productListMock.json';

export const getMockProductsFromDb = (): Promise<Product[]> =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(productList);
    }, 1000);
  });

export const getMockProductFromDbById = (id: string): Promise<Product | undefined> =>
  new Promise(resolve => {
    setTimeout(() => {
      const product = productList.find(product => product.id === id);

      resolve(product);
    }, 1000);
  });
