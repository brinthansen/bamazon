DROP DATABASE IF EXISTS bamazonDB;
CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NULL,
  department_name VARCHAR(100) null,
  price decimal(10,2) null,
  stock_quantity integer null,
  product_sales decimal(10,2) null,
  PRIMARY KEY (item_id)
);

CREATE TABLE departments(
  department_ID INT NOT NULL AUTO_INCREMENT,
  department_name varchar(100) null,
  overHeadCosts decimal(10,2) null,
  PRIMARY KEY (department_ID)
)

INSERT INTO products (product_name,department_name,price,stock_quantity)
VALUES ("Dog Whistle","Pets",5.00,17), ("Go Kart","Automobiles",199.99,11),("Lasso","Farming",7.99,10),("Cow Treats","Farming",11.99,10),("Hair Buzzer","electronics",19.99,3), ("Socks","Clothing",4.99,8),("Yakuza","Video Games",59.99,35),("wireless mouse","electronics",19.99,50);

INSERT INTO departments (department_name, overHeadCosts)
VALUES ("Pets",100), ("clothing",500), ("Farming", 75), ("electronics", 325), ("Automobiles", 600) ("Video Games", 100);