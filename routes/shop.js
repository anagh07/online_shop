const express = require('express');

const router = express.Router();

const shopController = require('../controllers/shop');
const isAuth = require('../middlewares/isAuth');

// @METHOD  GET
// @ROUTE   /
router.get('/', shopController.getIndex);

// @METHOD  GET
// @ROUTE   /prod-list
router.get('/prod-list', shopController.getAllProductList);

// @METHOD  GET
// @ROUTE   /cart
router.get('/cart', isAuth, shopController.getCart);

// @METHOD  POST
// @ROUTE   /cart
// @DESC    add item to cart
router.post('/cart', isAuth, shopController.addToCart);

// @METHOD  POST
// @ROUTE   /cart/delete-cart-item
// @DESC    delete item from cart
router.post('/cart/delete-cart-item', isAuth, shopController.deleteFromCart);

// @METHOD  GET
// @ROUTE   /orders
router.get('/orders', isAuth, shopController.getOrder);

// @METHOD  POST
// @ROUTE   /checkout
router.post('/place-order', isAuth, shopController.postOrder);

// @METHOD  GET
// @ROUTE   /prod-list/:prodId
router.get('/prod-list/:prodId', shopController.getProductDetails);

module.exports = router;
