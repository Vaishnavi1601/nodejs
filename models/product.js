const Sequelize = require('sequelize');  //importing  sequelize , it will return bacl a class or constructor function 

const sequelize = require('../util/database');

// model that will be managed by sequelize
//"product" name of our model and second argument defines structure of our model and also automatically created db table
 
const Product =sequelize.define('product', {  
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  title: Sequelize.STRING,
  price: {
    type:Sequelize.DOUBLE,
    allowNull:false,
  },
  imageUrl: {
    type:Sequelize.STRING,
    allowNull:false
  },
  description:{
    type:Sequelize.STRING,
    allowNull: false
  }
});

module.exports = Product;