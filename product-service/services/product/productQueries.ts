export const createProductsTableQuery = `
  create extension if not exists "uuid-ossp";

  create table if not exists products (
    id uuid primary key default uuid_generate_v4() unique,
    title text not null unique,
    description text,
    price int,
    image_url text
  )
`;

export const addProductsQuery = `
  insert into products (title, description, price, image_url) values
    ('The weekend in Cappadocia', 'Do you dream of a land with abounding fairy chimney rock formations, underground cities and churches inside rock-cut caves?', 1000, 'https://www.blueeyetour.com/assets/resimler/turlar/2e1ad-hot-air-balloons-1920x1080.jpg'),
    ('Erciyes ski New Year tour', 'Skiing is one of the best activity that is very close to the Göreme town. Mount Erciyes at Kayseri is the local skiing center', 1500, 'https://img.itinari.com/activity/images/original/2b40b4e1-e527-4c30-b56a-31d90fe35568-erciyes-kayak-merkezi-1024x686.jpg?ch=DPR&dpr=1&w=1200&h=800&s=f83760cfb0ad85c01a0f89404199386b'),
    ('Mexico City: Teotihuacan, Shrine of Guadalupe & Tlatelolco', 'After being picked up from your hotel or accommodation, travel with your guide to the first stop on the tour, Tlatelolco.', 3000, 'https://www.history.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTU3ODc5MDg3MjM4NDIzODgx/mexico-anahuac-teotihuacan-pyramid-de-la-luna.jpg'),
    ('The weekend in Amsterdam', 'From kayaking the iconic canals to discovering its world-famous art tradition, exploring Amsterdam can feel like walking through a dream. Find the best things to do and make the most of your visit to the Dutch capital.', 1000, 'https://www.telegraph.co.uk/content/dam/insurance/2016/04/06/amsterdam.jpg'),
    ('In love with Paris', 'Embark on a cruise on the River Seine that begins at the foot of the Eiffel Tower.', 2000, 'https://static.toiimg.com/thumb/69359415/paris.jpg?width=1200&height=900'),
    ('Disneyland in Paris', 'In a fantasy world not so far away, Disney heroes and heroines live in fairytales that are, happily, never-ending. Enjoy endless fun in 5 magical lands!', 1000, 'https://www.sortiraparis.com/images/80/76154/455912-laurentp-disneyland-paris.jpg') on conflict do nothing
`;

export const getProductsQuery = `select * from products`;
export const getProductsWithStocksQuery = `select products.*, count from products join stocks on id = product_id`;

export const getProductByIdQuery = `select products.*, count from products join stocks on id = product_id where id = $1`;

export const insertProductQuery = `
    insert into products (title, description, price, image_url) values ($1, $2, $3, $4) returning *
  `;

export const insertProductsQuery = `
  with product_ids as (
    insert into products (title, description, price, image_url)
    select * from unnest ($1::text[], $2::text[], $3::int[], $4::text[])
    on conflict (title) do update
    set title = products.title
    returning *
  ),
  count_list as (
    insert into stocks (product_id, count)
    select * from unnest (array(select id from product_ids), $5::int[])
    on conflict do nothing
    returning count
  )
  select distinct on (title) * from product_ids, count_list
`;
