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

exports.getEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  Product.findById(prodId, (data) => {
    if (!data) return res.redirect('/admin/products');
    res.render('admin/edit-product.ejs', {
      pageTitle: 'Edit Product',
      path: '/admin/edit-product',
      editMode: true,
      prod: data,
    });
  });
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  const { title, imageUrl, price, desc } = req.body;
  const product = new Product(title, imageUrl, price, desc, prodId);
  // console.log(product);
  product.update();
  res.redirect('/admin/products');
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.prodId;
  Product.deleteById(prodId);
  res.redirect('/admin/products');
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
