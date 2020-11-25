export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  count: number;
}

export interface ProductBody {
  title: string;
  description: string;
  price: number | string;
  image_url: string;
}

export interface Stock {
  product_id: string;
  count: number;
}

export interface StockBody {
  count: number | string;
}

export type ProductWithStock = Product & Omit<Stock, 'product_id'>;

export type ProductWithStockBody = ProductBody & StockBody;
