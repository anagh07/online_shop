const Cart = require('./cart');
const db = require('../utils/database');
const query = require('../db_queries/product_queries');

module.exports = class Product {
  constructor(id, title, imageUrl, price, desc) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.desc = desc;
    this.price = price;
  }

  save() {
    return db.query(query.insertProd, [
      this.title,
      this.price,
      this.imageUrl,
      this.desc,
    ]);
  }

  update() {}

  static deleteById(id) {}

  static fetchAll() {
    return db.execute(query.getAllProd);
  }

  static findById(id) {
    return db.execute(query.findProd, [id]);
  }
};
