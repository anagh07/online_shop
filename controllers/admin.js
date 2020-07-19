const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  // res.sendFile(path.join(rootdir, 'views', 'add-product.html'));
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
  });
};

exports.postAddProducts = (req, res, next) => {
  // Extract data from req.body
  const { title, imageUrl, price, desc } = req.body;
  // Create new product object
  const product = new Product(title, imageUrl, price, desc);
  product.save();
  res.redirect('/');
};

exports.editProduct = (req, res) => {
  res.render('admin/edit-product', {
    path: '/admin/edit-product',
    pageTitle: 'Edit Product',
  });
};

exports.getProductsList = (req, res) => {
  Product.fetchAll((data) => {
    res.render('admin/product-list', {
      prod: data,
      path: '/admin/products',
      pageTitle: 'Admin Product List',
    });
  });
};
