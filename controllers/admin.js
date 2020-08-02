const Product = require('../models/product');

exports.getAddProducts = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postAddProducts = (req, res, next) => {
  // Extract data from req.body
  const { title, imageUrl, price, desc } = req.body;
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
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  const { title, imageUrl, price, desc } = req.body;

  Product.findById(prodId)
    .then((prod) => {
      prod.title = title;
      prod.imageUrl = imageUrl;
      prod.price = price;
      prod.desc = desc;
      return prod.save();
    })
    .then((result) => {
      // console.log('Product Updated');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.prodId;
  Product.deleteOne({ _id: prodId })
    .then((result) => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProductsList = (req, res) => {
  Product.find()
    // .populate('userId')
    .then((prods) => {
      // console.log(prods);
      res.render('admin/product-list', {
        prod: prods,
        path: '/admin/products',
        pageTitle: 'Admin Product List',
        isLoggedIn: req.session.isLoggedIn,
      });
    })
    .catch((err) => console.log(err));
};
