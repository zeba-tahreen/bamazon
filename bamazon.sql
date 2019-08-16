
create database bamazon;
use bamazon;
create table products (
item_id int(11) auto_increment primary key, 
product_name varchar(100), 
department_name varchar(100), 
price decimal(10,2), 
stock_quantity int(50)
);

insert into products value("dress", "women's apparel", 39.99, 41),
						  ("shirts", "mens clothing", 69.99, 45),
                          ("pants", "mens clothing", 29.99, 28),
                          ( "hats ", "kids clothing", 9.99 ,46),
                          ( )