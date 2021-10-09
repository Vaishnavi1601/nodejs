//connection to mdb
const getDb = require("../util/database").getdb;  // we can call this function to get access to our databse

//creating new Product(object)
class Product {
  //storing title,price,desc,imageurl when it gets created
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  //to save created product in db we use save method
  save() {
    
  }
}

// model that will be managed by sequelize
//"product" name of our model and second argument defines structure of our model and also automatically created db table

const Product = sequelize.define("product", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  title: Sequelize.STRING,
  price: {
    type: Sequelize.DOUBLE,
    allowNull: false,
  },
  imageUrl: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: false,
  },
});

module.exports = Product;
