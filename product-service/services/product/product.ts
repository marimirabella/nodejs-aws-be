import { getClient, Product, Stock } from '../../data-access';
import {
  createProductsTableQuery,
  addProductsQuery,
  getProductByIdQuery,
  getProductsWithStocksQuery,
  insertProductQuery,
} from './productQueries';
import {
  addStockItemsQuery,
  createStockTableQuery,
  getProductIdsQuery,
  createStockQuery,
} from './stockQueries';
import { begin, commit, rollback } from '../transactionQueries';

const defaultImgUrl =
  'https://lp-cms-production.imgix.net/features/2019/05/Solo-Travel-in-Nature-acbfea52bfaf.jpg';

export class ProductService {
  async getProducts(): Promise<Product[]> {
    const client = getClient();
    await client.connect();

    await client.query(createProductsTableQuery);
    await client.query(addProductsQuery);
    await this.addStocks();

    const { rows: products } = await client.query<Product>(getProductsWithStocksQuery);

    await client.end();

    return products;
  }

  async getProductById(id: string): Promise<Product | null> {
    const client = getClient();
    await client.connect();

    const {
      rows: [product],
    } = await client.query<Product>(getProductByIdQuery, [id]);

    await client.end();

    return product;
  }

  async createProduct(body: Product): Promise<Product> {
    const { title, description, price, image_url = defaultImgUrl, count } = body;
    const client = getClient();

    try {
      await client.connect();

      await client.query(begin);

      const values = [title, description, price, image_url];

      const {
        rows: [{ id }],
      } = await client.query<Product>(insertProductQuery, values);

      await client.query<Stock>(createStockQuery, [id, count]);

      await client.query(commit);

      const {
        rows: [product],
      } = await client.query<Product>(getProductByIdQuery, [id]);

      await client.end();

      return product;
    } catch (err) {
      await client.query(rollback);

      throw err;
    }
  }

  async addStocks(): Promise<void> {
    const client = getClient();
    await client.connect();

    await client.query(createStockTableQuery);

    const { rows: productIds } = await client.query<Record<string, string>>(getProductIdsQuery);

    await client.query(addStockItemsQuery(productIds));

    await client.end();
  }
}
