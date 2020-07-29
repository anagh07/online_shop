const mongodb = require('mongodb');

const getDb = require('../utils/database').getDb;

class User {
  constructor(name, email, cart, id) {
    this.name = name;
    this.email = email;
    this.cart = cart; // { items: [{prod: x, quantity: y}] }
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
}

module.exports = User;
