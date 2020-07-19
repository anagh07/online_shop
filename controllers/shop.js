const Product = require('../models/product');

exports.getIndex = (req, res, next) => {
  Product.fetchAll((data) => {
    res.render('shop/index', {
      prod: data,
      pageTitle: 'Shop',
      path: '/',
    });
  });
};

exports.getAllProductList = (req, res) => {
  Product.fetchAll((data) => {
    res.render('shop/prod-list', {
      prod: data,
      pageTitle: 'Products',
      path: '/prod-list',
    });
  });
};

exports.getCart = (req, res) => {
  res.render('shop/cart', {
    path: '/cart',
    pageTitle: 'My Cart',
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'My Orders',
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
