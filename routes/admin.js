const express = require('express');

const productController = require('../controllers/products');

const router = express.Router();

// GET /admin/add-product
router.get('/add-product', productController.getAddProducts);

// POST /admin/add-product
router.post('/add-product', productController.postAddProducts);

module.exports = router;
