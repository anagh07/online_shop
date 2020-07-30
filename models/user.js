const mongodb = require('mongodb');

const getDb = require('../utils/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [{prodId: x, quantity: y}] }
    this._id = id ? id : null;
  }

  save() {
    const db = getDb();
    db.collection('users')
      .insertOne(this)
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .find({ _id: new mongodb.ObjectID(userId) })
      .next()
      .then((user) => {
        return user;
      })
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const cartProdIndex = this.cart.items.findIndex((prod) => {
      return prod.prodId.toString() === product._id.toString();
    });

    let updatedCartItems = [...this.cart.items];
    let newQty = 1;

    if (cartProdIndex >= 0) {
      // Item exists
      newQty = updatedCartItems[cartProdIndex].qty + 1;
      updatedCartItems[cartProdIndex].qty = newQty;
    } else {
      // Items does not exist in cart
      updatedCartItems.push({
        prodId: new mongodb.ObjectID(product._id),
        qty: newQty,
      });
    }

    const updatedCart = { items: updatedCartItems };
    const db = getDb();
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then((result) => {})
      .catch((err) => console.log(err));
  }

  getCart() {
    const db = getDb();
    const prodIds = this.cart.items.map((item) => {
      return item.prodId;
    });
    return db
      .collection('products')
      .find({ _id: { $in: prodIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            qty: this.cart.items.find((item) => {
              return item.prodId.toString() === product._id.toString();
            }).qty,
          };
        });
      });
  }

  deleteItemFromCart(prodId) {
    const db = getDb();
    const updatedCartItems = this.cart.items.filter((item) => {
      return item.prodId.toString() !== prodId.toString();
    });
    return db
      .collection('users')
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then((result) => {})
      .catch((err) => console.log(err));
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then((products) => {
        const order = {
          createdAt: new Date(),
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.name,
            email: this.email,
          },
        };
        return db.collection('orders').insertOne(order);
      })
      .then((result) => {
        this.cart = { items: [] };
        return db
          .collection('users')
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: [] } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection('orders')
      .find({ 'user._id': new mongodb.ObjectID(this._id) })
      .toArray()
      .catch((err) => console.log(err));
  }
}

module.exports = User;
