const express = require('express');
const path = require('path');

const rootdir = require('./../utils/path');

const router = express.Router();

// GET /admin/add-product
router.get('/add-product', (req, res) => {
  console.log('"/add-product" route middleware');
  res.sendFile(path.join(rootdir, 'views', 'add-product.html'));
});

// POST /admin/add-product
router.post('/add-product', (req, res) => {
  console.log(req.body);
  res.redirect('/');
});

module.exports = router;
