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
// @ROUTE   /admin/edit-product/:prodId
router.get('/edit-product/:prodId', adminController.getEditProduct);

// @METHOD  POST 
// @ROUTE   /admin/edit-product/:prodId
router.post('/edit-product/:prodId', adminController.postEditProduct);

// @METHOD  POST 
// @ROUTE   /admin/delete-product
router.post('/delete-product', adminController.deleteProduct);

// @METHOD  GET 
// @ROUTE   /admin/product-list
router.get('/products', adminController.getProductsList);

module.exports = router;
