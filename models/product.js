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
    //accessing database by calling getDdb

    //1.database
    const db = getDb() 

    //2.collection and document
    //here we can call collection to tell mogodb into which collection we want to insert something
    db.collection('products')
    .insertOne(this)  // insertOne because we want to insert only one product, 
    //it only takes the object we want to insert, here we want to insert "product" so we use this
  }
}




module.exports = Product;
