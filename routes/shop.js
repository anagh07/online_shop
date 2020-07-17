const express = require('express');
const path = require('path');

const rootdir = require('./../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('shop.js', adminData.products);
  res.render('shop', {
    prod: adminData.products,
    pageTitle: 'Shop',
    path: '/',
    prodCheck: adminData.products.length > 0,
    productCSS: true,
    activeShop: true,
  });
});

module.exports = router;
