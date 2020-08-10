const Product = require('../models/product');
const { validationResult } = require('express-validator');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    title: '',
    imageUrl: '',
    price: '',
    desc: '',
    errors: [],
    hasError: false,
  });
};

exports.postAddProducts = (req, res, next) => {
  // Extract data from req.body
  const { title, imageUrl, price, desc } = req.body;
  // Extract error msgs from request
  const errors = validationResult(req);

  // For error re-render the page
  if (!errors.isEmpty()) {
    return res.status(422).render('admin/add-product', {
      pageTitle: 'Add Product',
      path: '/admin/add-product',
      title: title,
      imageUrl: imageUrl,
      price: price,
      desc: desc,
      errors: errors.errors,
      hasError: true,
      errorMsg: errors.errors[0].msg,
    });
  }

  const product = new Product({
    title: title,
    imageUrl: imageUrl,
    price: price,
    desc: desc,
    userId: req.session.user._id,
  });
  product
    .save()
    .then((result) => {
      // console.log(result);
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((prod) => {
      res.render('admin/edit-product.ejs', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode: true,
        prod: prod,
        hasError: false,
        errors: [],
        errorMsg: null,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  const { title, imageUrl, price, desc } = req.body;

  // Extract error msgs
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.render('admin/edit-product.ejs', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode: true,
      prod: {
        _id: prodId,
        title: title,
        imageUrl: imageUrl,
        price: price,
        desc: desc,
      },
      errorMsg: errors.errors[0].msg,
      hasError: true,
      errors: errors.errors,
    });
  }

  Product.findById(prodId)
    .then((prod) => {
      // If prod not posted by current user then exit
      if (prod.userId.toString() !== req.user._id.toString()) {
        req.flash('error', 'Cannot edit product not posted by self');
        return res.redirect('/');
      }
      prod.title = title;
      prod.imageUrl = imageUrl;
      prod.price = price;
      prod.desc = desc;
      return prod.save().then((result) => {
        // console.log('Product Updated');
        res.redirect('/admin/products');
      });
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.prodId;
  Product.deleteOne({ _id: prodId, userId: req.user._id })
    .then((result) => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProductsList = (req, res) => {
  Product.find({ userId: req.user._id })
    // .populate('userId')
    .then((prods) => {
      // console.log(prods);
      res.render('admin/product-list', {
        prod: prods,
        path: '/admin/products',
        pageTitle: 'Admin Product List',
      });
    })
    .catch((err) => console.log(err));
};
