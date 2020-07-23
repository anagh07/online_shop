const path = require('path');
const fs = require('fs');
const uniqid = require('uniqid');

const Cart = require('./cart');

// Find directory to data file
const path_data = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'products.json'
);

const readDataFile = (callback) => {
  fs.readFile(path_data, (err, fileData) => {
    if (err) callback([]);
    else callback(JSON.parse(fileData));
  });
};

module.exports = class Product {
  constructor(title, imageUrl, price, desc, id = uniqid()) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.price = price;
    this.desc = desc;
  }

  save() {
    readDataFile((data) => {
      // Push new data into products
      data.push(this);

      // Update data file
      fs.writeFile(path_data, JSON.stringify(data), (err) => {
        if (err) console.log(err);
      });
    });
  }

  update() {
    readDataFile((data) => {
      const existingProdIndex = data.findIndex((prod) => prod.id === this.id);
      const updatedProducts = [...data];
      updatedProducts[existingProdIndex] = this;

      fs.writeFile(path_data, JSON.stringify(updatedProducts), (err) => {
        if (err) console.log(err);
      });
    });
  }

  // static delete(id) {
  //   readDataFile((data) => {
  //     const prods = data.find((prod) => prod.id === id);
  //     const updatedProducts = data.filter((prod) => prod.id != id);
  //     console.log(updatedProducts);
  //     fs.writeFile(path_data, JSON.stringify(updatedProducts), (err) => {
  //       console.log(err);
  //     });
  //   });
  // }

  static deleteById(id) {
    readDataFile((products) => {
      const product = products.find((prod) => prod.id === id);
      const updatedProducts = products.filter((prod) => prod.id !== id);
      fs.writeFile(path_data, JSON.stringify(updatedProducts), (err) => {
        if (!err) {
          Cart.deleteFromCart(id, product.price);
        }
      });
    });
  }

  static fetchAll(callback) {
    readDataFile(callback);
  }

  static findById(id, callback) {
    readDataFile((data) => {
      const product = data.find((prod) => prod.id === id);
      callback(product);
    });
  }
};
