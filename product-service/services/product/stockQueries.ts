export const createStockTableQuery = `
  create table if not exists stocks (
    product_id uuid primary key references "products" ("id"),
    count int
  )
`;

export const addStockItemsQuery = (productIds: Record<string, string>[]) => {
  const stocks = productIds.map(({ id }) => ({
    id,
    count: Math.floor(Math.random() * (100 - 1) + 1),
  }));

  const stocksQuery = stocks.map(({ id, count }) => [`'${id}'`, count]).join('), \n (');

  return `
    insert into stocks (product_id, count) values
      (${stocksQuery}) on conflict do nothing
  `;
};

export const getProductIdsQuery = `select id from products`;

export const getStockItemsQuery = `select * from stocks`;

export const createStockQuery = `insert into stocks (product_id, count) values ($1, $2) returning *`

