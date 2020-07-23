const fs = require('fs');
const path = require('path');

// Path to our data file
const cart_path = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);

module.exports = class Cart {
  static addToCart(id, price) {
    //  Fetch existing cart from file
    fs.readFile(cart_path, (err, data) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(data);
      }

      // Find existing product and increase qty
      const existingProdIndex = cart.products.findIndex(
        (prod) => prod.id === id
      );
      const existingProd = cart.products[existingProdIndex];
      let updatedProd;
      // Add new prod/increase qty
      if (existingProd) {
        updatedProd = { ...existingProd };
        updatedProd.qty = updatedProd.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProdIndex] = updatedProd;
      } else {
        updatedProd = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProd];
      }
      cart.totalPrice = cart.totalPrice + Number(price);

      // Save to file
      fs.writeFile(cart_path, JSON.stringify(cart), (err) => {
        if (err) console.log(err);
      });
    });
  }

  static deleteFromCart(id, price) {
    fs.readFile(cart_path, (err, data) => {
      if (err) return;
      const updatedCart = { ...JSON.parse(data) };
      const deleteProd = updatedCart.products.find((prod) => prod.id === id);
      if (!deleteProd) return;
      const deleteProdQty = deleteProd.qty;
      updatedCart.products = updatedCart.products.filter(
        (prod) => prod.id !== id
      );
      updatedCart.totalPrice = updatedCart.totalPrice - price * deleteProdQty;

      fs.writeFile(cart_path, JSON.stringify(updatedCart), (err) => {
        console.log(err);
      });
    });
  }

  static fetchCartProducts(callback) {
    fs.readFile(cart_path, (err, data) => {
      const cart = JSON.parse(data);
      // console.log(cart);
      if (err) {
        callback(null);
      } else {
        callback(cart);
      }
    });
  }
};
