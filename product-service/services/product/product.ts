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

    const { rows: products } = await client.query<Product>(getProductByIdQuery, [id]);

    const product = products[0];

    await client.end();

    return product;
  }

  async createProduct({ title, description, price, image_url, count }: Product): Promise<Product> {
    const client = getClient();

    try {
      await client.connect();

      await client.query(begin);

      const values = [title, description, price, image_url];

      const { rows: products } = await client.query<Product>(insertProductQuery, values);
      const { id } = products[0];

      await client.query<Stock>(createStockQuery, [id, count]);

      await client.query(commit);

      const { rows: productsById } = await client.query<Product>(getProductByIdQuery, [id]);
      const product = productsById[0]

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
