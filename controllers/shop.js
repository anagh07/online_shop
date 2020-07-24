const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res, next) => {
  Product.fetchAll()
    .then(([data]) => {
      console.log(data);
      res.render('shop/index', {
        prod: data,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getAllProductList = (req, res) => {
  Product.fetchAll()
    .then(([data]) => {
      console.log(data);
      res.render('shop/prod-list', {
        prod: data,
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
      // console.log(prod[0][0].title);
      res.render('shop/prod-details', {
        path: '/prod-list',
        pageTitle: prod[0][0].title,
        prod: prod[0][0],
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  Cart.fetchCartProducts((cart_data) => {
    // console.log(cart_data);
    Product.fetchAll((products) => {
      // console.log(products);
      const cart_prods = [];
      for (product of products) {
        const prodData = cart_data.products.find(
          (cart_prod) => cart_prod.id === product.id
        );
        if (prodData) {
          // console.log(prodData);
          cart_prods.push({ prodData: product, qty: prodData.qty });
        }
      }
      // console.log(cart_prods);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'My Cart',
        products: cart_prods,
      });
    });
  });
};

exports.addToCart = (req, res) => {
  const prodId = req.body.prodId;
  Product.findById(prodId, (prod) => {
    Cart.addToCart(prodId, prod.price);
  });
  res.redirect('/cart');
};

exports.deleteFromCart = (req, res) => {
  const prodId = req.body.prodId;
  console.log(req.body);
  Product.findById(prodId, (prod) => {
    Cart.deleteFromCart(prodId, prod.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', {
    path: '/orders',
    pageTitle: 'My Orders',
  });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', {
    path: '/checkout',
    pageTitle: 'Checkout',
  });
};
