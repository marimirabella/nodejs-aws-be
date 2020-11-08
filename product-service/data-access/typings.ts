export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
  count: number;
}

export interface Stock {
  product_id: string;
  count: number;
}
