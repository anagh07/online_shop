const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');

// @METHOD  GET 
// @ROUTE   /
router.get('/', shopController.getIndex);

// @METHOD  GET 
// @ROUTE   /prod-list
router.get('/prod-list', shopController.getAllProductList);

// @METHOD  GET 
// @ROUTE   /cart
router.get('/cart', shopController.getCart);

// @METHOD  GET 
// @ROUTE   /orders
router.get('/orders', shopController.getOrders);

// @METHOD  GET 
// @ROUTE   /checkout
router.get('/checkout', shopController.getCheckout);

module.exports = router;
