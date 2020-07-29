const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.findAll()
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
  Product.findAll()
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
      // console.log(prod[0][0].title);
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
    .getCart()
    .then((cart) => {
      cart
        .getProducts()
        .then((products) => {
          res.render('shop/cart', {
            path: '/cart',
            pageTitle: 'My Cart',
            products: products,
          });
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
};

exports.addToCart = (req, res) => {
  const prodId = req.body.prodId;
  let fetchedCart;
  let newQty = 1;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product;
      if (products.length > 0) {
        product = products[0];
      }
      if (product) {
        // add code to increase qty
        let oldQty = product.cartItem.qty;
        newQty = oldQty + 1;
        return product;
      }
      return Product.findById(prodId);
    })
    .then((prod) => {
      fetchedCart.addProduct(prod, { through: { qty: newQty } });
    })
    .then(() => {
      // console.log(req);
      res.redirect(req.get('referer'));
    })
    .catch((err) => console.log(err));
};

exports.deleteFromCart = (req, res) => {
  const prodId = req.body.prodId;
  req.user
    .getCart()
    .then((cart) => {
      return cart.getProducts({ where: { id: prodId } });
    })
    .then((products) => {
      let product = products[0];
      return product.cartItem.destroy();
    })
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => console.log(err));
};

exports.getOrder = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => {
      console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'My Orders',
        orders: orders,
      });
    })
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedCart;
  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts();
    })
    .then((products) => {
      return req.user
        .createOrder()
        .then((order) => {
          return order.addProducts(
            products.map((prod) => {
              prod.orderItem = { qty: prod.cartItem.qty };
              return prod;
            })
          );
        })
        .catch((err) => console.log(err));
    })
    .then((result) => {
      fetchedCart.setProducts(null);
      res.redirect('/orders');
    })
    .catch((err) => console.log(err));
};
