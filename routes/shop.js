const express = require('express');
const path = require('path');

const rootdir = require('./../utils/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res, next) => {
  console.log('shop.js', adminData.products);
  res.render('shop', { prod: adminData.products, pageTitle: 'Shop', path: '/' });
});

module.exports = router;
