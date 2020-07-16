const express = require('express');
const path = require('path');

const rootdir = require('./../utils/path');

const router = express.Router();

const products = [];

// GET /admin/add-product
router.get('/add-product', (req, res) => {
  console.log('"/add-product" route middleware');
  // res.sendFile(path.join(rootdir, 'views', 'add-product.html'));
  res.render('add-product', { pageTitle: 'Add Product', path: '/admin/add-product' });
});

// POST /admin/add-product
router.post('/add-product', (req, res) => {
  products.push({ title: req.body.title });
  res.redirect('/');
});

module.exports.routes = router;
module.exports.products = products;
