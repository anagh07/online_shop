const Product = require('../models/product');
const { validationResult } = require('express-validator');
const serverErrorHandler = require('./error').serverErrorHandle;
const path = require('path');

const file = require('../utils/file');
const { dirname } = require('path');

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
   const { title, price, desc } = req.body;
   const imagefile = req.file;
   // Extract error msgs from request
   const errors = validationResult(req);

   if (!imagefile) {
      return res.status(422).render('admin/add-product', {
         pageTitle: 'Add Product',
         path: '/admin/add-product',
         title: title,
         price: price,
         desc: desc,
         errors: errors.errors,
         hasError: true,
         errorMsg: 'Attached file is not an image',
      });
   }

   const imageUrl = path.normalize('/' + imagefile.path);

   // For error re-render the page
   if (!errors.isEmpty()) {
      return res.status(422).render('admin/add-product', {
         pageTitle: 'Add Product',
         path: '/admin/add-product',
         title: title,
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
      .catch((err) => {
         return serverErrorHandler(err, next);
      });
};

exports.getEditProduct = (req, res, next) => {
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
      .catch((err) => {
         return serverErrorHandler(err, next);
      });
};

exports.postEditProduct = (req, res, next) => {
   const prodId = req.params.prodId;
   const { title, price, desc } = req.body;
   const imagefile = req.file;

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
         if (imagefile) {
            // The slash makes the path absolute path from the root dir of project
            prod.imageUrl = path.normalize('/' + imagefile.path);
            // Delete existing image file
            file.deleteProdImage(imagefile.path);
         }
         prod.price = price;
         prod.desc = desc;
         return prod.save().then((result) => {
            // console.log('Product Updated');
            res.redirect('/admin/products');
         });
      })
      .catch((err) => {
         return serverErrorHandler(err, next);
      });
};

exports.deleteProduct = (req, res, next) => {
   const prodId = req.params.prodId;
   // Delete the existing image file from storage
   Product.findById(prodId)
      .then((prod) => {
         if (!prod) {
            return serverErrorHandler('Cannot delete, prod not found', next);
         }
         const filePath = path.join(
            path.dirname(process.mainModule.filename),
            prod.imageUrl
         );
         file.deleteProdImage(filePath, next);
         return Product.deleteOne({ _id: prodId, userId: req.user._id });
      })
      .then((result) => {
         res.status(200).json({ message: 'Successfully deleted' });
      })
      .catch((err) => {
         res.status(500).json({ message: 'Failed to delete product' });
      });
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
      .catch((err) => {
         return serverErrorHandler(err, next);
      });
};
