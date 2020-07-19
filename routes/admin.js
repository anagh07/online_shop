const express = require('express');

const adminController = require('../controllers/admin');

const router = express.Router();

// @METHOD  GET 
// @ROUTE   /admin/add-product
router.get('/add-product', adminController.getAddProducts);

// @METHOD  POST 
// @ROUTE   /admin/add-product
router.post('/add-product', adminController.postAddProducts);

// @METHOD  GET 
// @ROUTE   /admin/edit-product
router.get('/edit-product', adminController.editProduct);

// @METHOD  GET 
// @ROUTE   /admin/product-list
router.get('/products', adminController.getProductsList);

module.exports = router;
