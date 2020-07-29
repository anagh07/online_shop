const mongodb = require('mongodb');

const getDb = require('../utils/database').getDb;

class Product {
  constructor(title, price, imageUrl, desc, id, userId) {
    this.title = title;
    this.price = price;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this._id = id ? new mongodb.ObjectID(id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbreturn;
    if (this._id) {
      // Update
      dbreturn = db
        .collection('products')
        .updateOne({ _id: new mongodb.ObjectID(this._id) }, { $set: this });
    } else {
      // Save new
      dbreturn = db.collection('products').insertOne(this);
    }
    return dbreturn
      .then((result) => {
        return result;
      })
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        // console.log(products);
        return products;
      })
      .catch((err) => console.log(err));
  }

  static findById(prodId) {
    const db = getDb();
    prodId = new mongodb.ObjectID(prodId);
    return db
      .collection('products')
      .find({ _id: prodId })
      .next()
      .then((prod) => {
        // console.log(prod);
        return prod;
      })
      .catch((err) => console.log(err));
  }

  static delete(prodId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectID(prodId) })
      .then((result) => {})
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
