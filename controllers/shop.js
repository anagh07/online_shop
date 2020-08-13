const path = require('path');
const fs = require('fs');
const Product = require('../models/product');
const Order = require('../models/order');
const serverErrorHandler = require('./error').serverErrorHandle;
const PDFDocument = require('pdfkit');

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
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
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
    })
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
};

exports.deleteFromCart = (req, res) => {
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
    .catch((err) => {
      return serverErrorHandler(err, next);
    });
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
        return serverErrorHandler(
          'You can only get orders placed by yourself!',
          next
        );
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
      res.setHeader(
        'Content-Disposition',
        `attachment; filename="${fileName}"`
      );
      pdf.pipe(fs.createWriteStream(filePath));
      pdf.pipe(res);
      // PDF content
      pdf.fontSize(22).text('Invoice');
      pdf.fontSize(14).text(`Order number: ${order._id.toString()}`);
      pdf.text(
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
      );
      let totalPrice = 0;
      order.products.forEach((prod) => {
        totalPrice += prod.product.price * prod.qty;
        pdf.text(
          `${prod.product.title} - ${prod.qty} - $${prod.product.price}`
        );
      });
      pdf.text(
        '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -'
      );
      pdf.text(`Total Price: $${totalPrice}`);
      pdf.end();
    })
    .catch((err) => next(err));
};
