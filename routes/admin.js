const express = require('express');

const adminController = require('../controllers/admin');
const isAuth = require('../middlewares/isAuth');

const router = express.Router();

// @METHOD  GET
// @ROUTE   /admin/add-product
router.get('/add-product', isAuth, adminController.getAddProducts);

// @METHOD  POST
// @ROUTE   /admin/add-product
router.post('/add-product', isAuth, adminController.postAddProducts);

// @METHOD  GET
// @ROUTE   /admin/edit-product/:prodId
router.get('/edit-product/:prodId', isAuth, adminController.getEditProduct);

// @METHOD  POST
// @ROUTE   /admin/edit-product/:prodId
router.post('/edit-product/:prodId', isAuth, adminController.postEditProduct);

// @METHOD  POST
// @ROUTE   /admin/delete-product
router.post('/delete-product', isAuth, adminController.deleteProduct);

// @METHOD  GET
// @ROUTE   /admin/product-list
router.get('/products', isAuth, adminController.getProductsList);

module.exports = router;
