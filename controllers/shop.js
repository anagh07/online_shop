const Product = require('../models/product');
const Order = require('../models/order');

exports.getIndex = (req, res) => {
  Product.find()
    .then((prods) => {
      let tempMsg = req.flash('resetPasswordEmailSent');
      let errorMsg = tempMsg.length === 0 ? null : tempMsg;
      tempMsg = req.flash('error');
      errorMsg = tempMsg.length === 0 ? null : tempMsg;
      res.render('shop/index', {
        prod: prods,
        pageTitle: 'Shop',
        path: '/',
        errorMsg: errorMsg,
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
        isLoggedIn: req.session.isLoggedIn,
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
      // console.log(prods);
      res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'My Cart',
        products: prods,
      });
    })
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res) => {
  if (!req.session.isLoggedIn) {
    return res.redirect('/login');
  }
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

exports.getOrder = (req, res) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      // console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'My Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  req.user
    .populate('cart.items.prodId')
    .execPopulate()
    .then((user) => {
      const products = user.cart.items.map((item) => {
        return { product: { ...item.prodId._doc }, qty: item.qty };
      });
      const order = new Order({
        user: {
          name: req.user.name,
          userId: req.user._id,
        },
        products: products,
      });
      return order.save();
    })
    .then((result) => {
      return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};
