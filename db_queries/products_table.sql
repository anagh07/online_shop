USE online_shop;

CREATE TABLE products (
	`id` INTEGER NOT NULL auto_increment PRIMARY KEY,
    `title` VARCHAR(255) NOT NULL,
    `price` DOUBLE NOT NULL,
    `desc` TEXT NOT NULL,
    `imageUrl` VARCHAR(255) NOT NULL
);

INSERT INTO online_shop.products ( title, price, `desc`, imageUrl )
VALUES (
	'Bad product',
    '4.5',
    'Product for dummies',
    'https://cdn.morphsuits.co.uk/media/catalog/product/cache/4/image/930x/9df78eab33525d08d6e5fb8d27136e95/c/r/crash-test-dummy-morphsuit-1.1572911463.jpg'
);