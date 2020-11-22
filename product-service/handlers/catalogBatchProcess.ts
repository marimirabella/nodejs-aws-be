
import { SQSHandler } from 'aws-lambda';

import { ProductService } from '../services/product';
import { Cost, publishSns } from './utils';

const Product = new ProductService();

export const catalogBatchProcess: SQSHandler = async ({ Records }) => {
  try {
    console.log('catalog batch process', Records);

    const productsBody = Records.map(({ body }) => JSON.parse(body));

    const products = await Product.createProducts(productsBody);

    const budgetProducts = products?.filter(({ price }) => price <= 500);
    const expensiveProducts = products?.filter(({ price }) => price > 500);

    if (budgetProducts?.length) {
      await publishSns(Cost.Budget, budgetProducts);
    }

    if (expensiveProducts?.length) {
      await publishSns(Cost.Expensive, expensiveProducts);
    }
  } catch (err) {
    console.log('Catalog batch error', err.message);
  }
};
