const Product = require('../models/product');
const User = require('../models/user');

exports.getIndex = (req, res) => {
  Product.find()
    .then((prods) => {
      res.render('shop/index', {
        prod: prods,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getAllProductList = (req, res) => {
  Product.find()
    .then((prods) => {
      res.render('shop/prod-list', {
        prod: prods,
        pageTitle: 'Products',
        path: '/prod-list',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProductDetails = (req, res) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((prod) => {
      // console.log(prod);
      res.render('shop/prod-details', {
        path: '/prod-list',
        pageTitle: prod.title,
        prod: prod,
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .populate('cart.items.prodId')
    .execPopulate()
    .then((user) => {
      const prods = user.cart.items;
      console.log(prods);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'My Cart',
        products: prods,
      });
    })
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res) => {
  const prodId = req.body.prodId;
  Product.findById(prodId)
    .then((prod) => {
      // console.log(prod);
      return req.user.addToCart(prod);
    })
    .then((result) => {
      res.redirect(req.get('referer'));
    });
};

exports.deleteFromCart = (req, res) => {
  const prodId = req.body.prodId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

// exports.getOrder = (req, res) => {
//   req.user
//     .getOrders()
//     .then((orders) => {
//       res.render('shop/orders', {
//         path: '/orders',
//         pageTitle: 'My Orders',
//         orders: orders,
//       });
//     })
//     .catch((err) => console.log(err));
// };

// exports.postOrder = (req, res) => {
//   req.user
//     .addOrder()
//     .then((result) => {
//       res.redirect('/orders');
//     })
//     .catch((err) => console.log(err));
// };
