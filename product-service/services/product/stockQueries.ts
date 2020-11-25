export const createStockTableQuery = `
  create table if not exists stocks (
    product_id uuid primary key references "products" ("id"),
    count int
  )
`;

export const addStockItemsQuery = `
  insert into stocks (product_id, count) select * from unnest ($1::uuid[], $2::int[]) on conflict do nothing`;

export const getProductIdsQuery = `select id from products`;

export const getStockItemsQuery = `select * from stocks`;

export const createStockQuery = `insert into stocks (product_id, count) values ($1, $2) returning *`;
