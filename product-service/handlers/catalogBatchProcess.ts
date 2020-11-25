
import { SQSHandler } from 'aws-lambda';

import { ProductService } from '../services/product';
import { publishSns } from './utils';

const Product = new ProductService();

export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  try {
    console.log('catalog batch process', Records);

    const productsBody = Records.map(({ body }) => JSON.parse(body));

    const products = await Product.createProducts(productsBody);

    if (products?.length) {
      await publishSns(products);
    }
  } catch (err) {
    console.log('Catalog batch error', err.message);
  }
};
