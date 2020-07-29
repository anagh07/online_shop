const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const CartItem = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  qty: {
    type: Sequelize.INTEGER,
    defaultValue: 1,
  },
});

module.exports = CartItem;
