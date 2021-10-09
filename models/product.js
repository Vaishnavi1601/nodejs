//connection to mdb
const getDb = require("../util/database").getDb;  // we can call this function to get access to our databse

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
    const db = getDb() ;

    //2.collection and document
    //here we can call collection to tell mogodb into which collection we want to insert something
    return db.collection('products')
    .insertOne(this)  // insertOne because we want to insert only one product, 
    //it only takes the object we want to insert, here we want to insert "product" we use this

    .then(result =>{
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    });
  
  }

  //get product in products page
  static fetchAll() {
    const db = getDb() ;  //acessing db 

    return db.collection('products').find()//find doesnt retirn a prommise instead it returns a cursor
    // cursor is a object  provided by mongodb which allows us to go through our elements 
    // find gives us a handle which we can use to tell mdb to give the next document
    // there's toArray method -- to get all documents and turn them into js array (used only when we have some documents  otherwise we use pagination)
    .toArray() //this returns a promise
    .then(products => {
      console.log(products);
      return products;
    })
    .catch(err => {
      console.log(err);
    })
  }
}


//get products by adidng static method



module.exports = Product;
