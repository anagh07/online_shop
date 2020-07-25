const Sequelize = require('sequelize');

const sequelize = new Sequelize('online_shop', 'root', 'iddqdidkfa', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
