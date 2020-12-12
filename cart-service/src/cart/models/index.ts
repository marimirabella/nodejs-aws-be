export type Product = {
  id: string;
  title: string;
  description: string;
  price: number;
  image_url: string;
};

export type CartItem = {
  product: Product;
  count: number;
};

export type Cart = {
  id: string;
  items: CartItem[];
};
