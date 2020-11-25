import {} from './../../data-access';
import {
  getClient,
  Product,
  ProductWithStock,
  ProductWithStockBody,
  Stock,
} from '../../data-access';
import { begin, commit, rollback } from '../transactionQueries';
import {
  getAddStockQueryValues,
  getAddProductsQueryValues,
  parseProduct,
  parseProducts,
} from './utils';
import {
  createProductsTableQuery,
  addProductsQuery,
  getProductByIdQuery,
  getProductsWithStocksQuery,
  insertProductQuery,
  insertProductsQuery,
} from './productQueries';
import {
  addStockItemsQuery,
  createStockTableQuery,
  getProductIdsQuery,
  createStockQuery,
} from './stockQueries';
export class ProductService {
  async getProducts(): Promise<ProductWithStock[]> {
    const client = getClient();
    await client.connect();

    await client.query(createProductsTableQuery);
    await client.query(addProductsQuery);
    await this.addStocks();

    const { rows: products } = await client.query<ProductWithStock>(getProductsWithStocksQuery);

    await client.end();

    return products;
  }

  async getProductById(id: string): Promise<ProductWithStock | null> {
    const client = getClient();
    await client.connect();

    const {
      rows: [product],
    } = await client.query<ProductWithStock>(getProductByIdQuery, [id]);

    await client.end();

    return product;
  }

  async createProduct(body: ProductWithStockBody): Promise<Product> {
    const client = getClient();

    try {
      await client.connect();

      await client.query(begin);

      const { title, description, price, image_url, count } = parseProduct(body);
      const values = [title, description, price, image_url];

      const {
        rows: [{ id }],
      } = await client.query<Product>(insertProductQuery, values);

      await client.query<Stock>(createStockQuery, [id, count]);

      await client.query(commit);

      const {
        rows: [product],
      } = await client.query<ProductWithStock>(getProductByIdQuery, [id]);

      await client.end();

      return product;
    } catch (err) {
      await client.query(rollback);

      throw err;
    }
  }

  async createProducts(body: ProductWithStockBody[]): Promise<ProductWithStock[] | null> {
    const client = getClient();

    try {
      await client.connect();

      await client.query(begin);

      const values = getAddProductsQueryValues(parseProducts(body));

      const { rows: products } = await client.query<ProductWithStock>(insertProductsQuery, values);

      await client.query(commit);

      await client.end();

      return products;
    } catch (err) {
      await client.query(rollback);

      throw err;
    }
  }

  async addStocks(): Promise<void> {
    const client = getClient();
    try {
      await client.connect();

      await client.query(createStockTableQuery);

      const { rows: productIds } = await client.query<Record<string, string>>(getProductIdsQuery);

      const values = getAddStockQueryValues(productIds);

      await client.query(addStockItemsQuery, values);

      await client.end();
    } catch (err) {
      throw err;
    }
  }
}
