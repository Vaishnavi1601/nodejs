const Sequelize = require('sequelize');

const sequelize = require('../util/database');

// cart should belong to single user but may hold multiple product
//cart table should hold different carts for diffrent user
const Cart = sequelize.define('cart', {
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  }
});

module.exports = Cart;