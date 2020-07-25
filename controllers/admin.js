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
  Product.create({
    title: title,
    price: price,
    imageUrl: imageUrl,
    desc: desc,
  })
    .then((result) => {
      res.redirect('/');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const prodId = req.params.prodId;
  Product.findById(prodId)
    .then((prod) => {
      if (!prod) return res.redirect('/admin/products');
      res.render('admin/edit-product.ejs', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editMode: true,
        prod: prod,
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
      console.log('Product Updated');
      res.redirect('/admin/products');
    })
    .catch();
};

exports.deleteProduct = (req, res) => {
  const prodId = req.body.prodId;
  Product.findById(prodId)
    .then((prod) => {
      return prod.destroy();
    })
    .then((result) => {
      console.log('Product deleted');
      res.redirect('/admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getProductsList = (req, res) => {
  Product.findAll()
    .then((prods) => {
      res.render('admin/product-list', {
        prod: prods,
        path: '/admin/products',
        pageTitle: 'Admin Product List',
      });
    })
    .catch((err) => console.log(err));
};
