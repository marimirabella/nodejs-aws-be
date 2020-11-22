import { ProductWithStock, ProductWithStockBody } from '../../../data-access';
import { defaultImgUrl } from '../constants';

export const parseProduct = ({
  title,
  description,
  price,
  image_url = defaultImgUrl,
  count,
}: ProductWithStockBody): Omit<ProductWithStock, 'id'> => ({
  title,
  description,
  price: Number(price),
  image_url: image_url ? image_url : defaultImgUrl,
  count: Number(count),
});

export const parseProducts = (products: ProductWithStockBody[]) => products.map(parseProduct);
