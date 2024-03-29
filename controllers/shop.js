const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const serverErrorHandler = require('./error').serverErrorHandle;
const PDFDocument = require('pdfkit');
const env = require('dotenv');
env.config({ path: './config.env' });
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const ITEMS_PER_PAGE = 5;

exports.getIndex = (req, res, next) => {
  const pageNum = parseInt(req.query.page) || 1;
  let totalNumOfProd = 0;
  Product.find()
    .countDocuments()
    .then((prodNum) => {
      totalNumOfProd = prodNum;
      return Product.find()
        .skip((pageNum - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
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
        totalProducts: totalNumOfProd,
        hasNextPage: pageNum * ITEMS_PER_PAGE < totalNumOfProd,
        hasPreviousPage: pageNum > 1,
        nextPage: pageNum + 1,
        previousPage: pageNum - 1,
        lastPage: Math.ceil(totalNumOfProd / ITEMS_PER_PAGE),
        currentPage: pageNum,
      });
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getAllProductList = (req, res, next) => {
  const pageNum = parseInt(req.query.page) || 1;
  let totalNumOfProd = 0;
  Product.find()
    .countDocuments()
    .then((prodNum) => {
      totalNumOfProd = prodNum;
      return Product.find()
        .skip((pageNum - 1) * ITEMS_PER_PAGE)
        .limit(ITEMS_PER_PAGE);
    })
    .then((prods) => {
      res.render('shop/prod-list', {
        prod: prods,
        pageTitle: 'Products',
        path: '/prod-list',
        totalProducts: totalNumOfProd,
        hasNextPage: pageNum * ITEMS_PER_PAGE < totalNumOfProd,
        hasPreviousPage: pageNum > 1,
        nextPage: pageNum + 1,
        previousPage: pageNum - 1,
        lastPage: Math.ceil(totalNumOfProd / ITEMS_PER_PAGE),
        currentPage: pageNum,
      });
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
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
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getCart = (req, res, next) => {
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
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.addToCart = (req, res, next) => {
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
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.deleteFromCart = (req, res, next) => {
  const prodId = req.body.prodId;
  req.user
    .deleteItemFromCart(prodId)
    .then((result) => {
      res.redirect('/cart');
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getOrder = (req, res, next) => {
  Order.find({ 'user.userId': req.user._id })
    .then((orders) => {
      // console.log(orders);
      res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'My Orders',
        orders: orders,
      });
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getCheckoutSuccess = (req, res) => {
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
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getOrderInvoice = (req, res, next) => {
  orderId = req.params.orderId;
  // Check if correct user is logged in
  Order.findById(orderId)
    .then((order) => {
      if (!order) {
        return serverErrorHandler('Order not found', next);
      }
      if (order.user.userId.toString() !== req.user._id.toString()) {
        return serverErrorHandler('You can only get orders placed by yourself!', next);
      }
      const fileName = 'invoice_' + orderId + '.pdf';
      const filePath = path.join('data', 'invoices', fileName);
      // // Preload and send at once
      // fs.readFile(filePath, (err, data) => {
      //   if (err) next(err);
      //   res.setHeader('Content-type', 'application/pdf');
      //   res.setHeader(
      //     'Content-Disposition',
      //     `attachment; filename="${fileName}"`
      //   );
      //   res.send(data);
      // });

      // // Send file as stream
      // const file = fs.createReadStream(filePath);
      // res.setHeader('Content-type', 'application/pdf');
      // res.setHeader(
      //   'Content-Disposition',
      //   `attachment; filename="${fileName}"`
      // );
      // file.pipe(res);

      // Generate pdf and send as stream
      const pdf = new PDFDocument();
      res.setHeader('Content-type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
      pdf.pipe(fs.createWriteStream(filePath));
      pdf.pipe(res);
      // PDF content
      pdf.fontSize(22).text('Invoice');
      pdf.fontSize(14).text(`Order number: ${order._id.toString()}`);
      pdf.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.product.price * prod.qty;
        pdf.text(`${prod.product.title} - ${prod.qty} - $${prod.product.price}`);
      });
      pdf.text('- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -');
      pdf.text(`Total Price: $${totalPrice}`);
      pdf.end();
    })
    .catch((err) => next(err));
};

exports.getCheckout = (req, res, next) => {
  let prods;
  let totalPrice = 0;
  req.user
    .populate('cart.items.prodId')
    .execPopulate()
    .then((user) => {
      prods = user.cart.items;
      prods.forEach((prod) => {
        totalPrice += prod.prodId.price * prod.qty;
      });
      // Create payment session
      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: prods.map((p) => {
          return {
            name: p.prodId.title,
            description: p.prodId.desc,
            amount: p.prodId.price * 100,
            currency: 'usd',
            quantity: p.qty,
          };
        }),
        success_url: req.protocol + '://' + req.get('host') + '/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/checkout/cancel',
      });
    })
    .then((session) => {
      res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
        products: prods,
        totalPrice: totalPrice,
        sessionId: session.id,
      });
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.getPingMe = (req, res, next) => {
  console.log('I was pinged!');
  res.send('I am alive!');
};
