create table if not exists products (
	id uuid primary key default uuid_generate_v4() unique,
	title text not null,
	description text,
	price int,
	image_url text
);

create table if not exists stocks (
	product_id uuid primary key references "products" ("id"),
	count int
);

insert into products (title, description, price, image_url) values
	('The weekend in Cappadocia', 'Do you dream of a land with abounding fairy chimney rock formations, underground cities and churches inside rock-cut caves?', 1000, 'https://www.impetustravel.com/wp-content/uploads/2020/06/cap1.jpg'),
	('Erciyes ski New Year tour', 'Skiing is one of the best activity that is very close to the Göreme town. Mount Erciyes at Kayseri is the local skiing center', 1500, 'https://img.itinari.com/activity/images/original/2b40b4e1-e527-4c30-b56a-31d90fe35568-erciyes-kayak-merkezi-1024x686.jpg?ch=DPR&dpr=1&w=1200&h=800&s=f83760cfb0ad85c01a0f89404199386b'),
	('Mexico City: Teotihuacan, Shrine of Guadalupe & Tlatelolco', 'After being picked up from your hotel or accommodation, travel with your guide to the first stop on the tour, Tlatelolco.', 3000, 'https://www.history.com/.image/c_fit%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_620/MTU3ODc5MDg3MjM4NDIzODgx/mexico-anahuac-teotihuacan-pyramid-de-la-luna.jpg'),
	('The weekend in Amsterdam', 'From kayaking the iconic canals to discovering its world-famous art tradition, exploring Amsterdam can feel like walking through a dream. Find the best things to do and make the most of your visit to the Dutch capital.', 1000, 'https://www.telegraph.co.uk/content/dam/insurance/2016/04/06/amsterdam.jpg'),
	('In love with Paris', 'Embark on a cruise on the River Seine that begins at the foot of the Eiffel Tower.', 2000, 'https://static.toiimg.com/thumb/69359415/paris.jpg?width=1200&height=900'),
	('Disneyland in Paris', 'In a fantasy world not so far away, Disney heroes and heroines live in fairytales that are, happily, never-ending. Enjoy endless fun in 5 magical lands!', 1000, 'https://www.sortiraparis.com/images/80/76154/455912-laurentp-disneyland-paris.jpg');

insert into stocks (product_id, count) values
	('5e3e3fa3-0149-4813-8f90-969eec72459f', 20),
	('328097c7-5bff-43cd-951a-8e80d0ad274b', 30),
	('e3d88ae5-be75-41b5-baef-2158276b31c6', 25),
	('dc9b0c33-0850-43ac-b60f-b02593e0dbb3', 15),
	('26096e80-6dd7-431d-a5bb-7fab1264cc7a', 10),
	('ca6ba11e-719b-41eb-999c-c8274e603536', 10);

create extension if not exists "uuid-ossp";