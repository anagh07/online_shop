const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const OrderItem = sequelize.define('orderItem', {
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  qty: Sequelize.INTEGER,
});

module.exports = OrderItem;
