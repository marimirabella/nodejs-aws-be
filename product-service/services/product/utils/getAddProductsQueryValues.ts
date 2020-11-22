import { Product } from '../../../data-access';

type AddProductsQueryValues = Array<(string | number)[]>;

export const getAddProductsQueryValues = (products: Omit<Product, 'id'>[]) =>
  products.reduce(
    (values: AddProductsQueryValues, { title, description, price, image_url, count }) => {
      [title, description, price, image_url, count]
        .filter(el => !!el)
        .forEach((el, i) => {
          values[i] = values[i] ? [...values[i], el] : [el];
        });

      return values;
    },
    []
  );
