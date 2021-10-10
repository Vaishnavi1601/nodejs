const mongodb = require("mongodb");

//connection to mdb
const getDb = require("../util/database").getDb; // we can call this function to get access to our databse

//creating new Product(object)
//class declaration creates a new class with a given name
class Product {
  //constructor method is a special method of a class for creating and initializing an object instance of that class.
  //storing title,price,desc,imageurl when it gets created
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    //converting the id which is string to object
    this._id = id ? new mongodb.ObjectId(id) : null;
    this.userId  = userId;
  }

  //to save created product in db we use save method
  save() {
    //accessing database by calling getDdb

    //1.database
    const db = getDb();
    let dbOp;

    if (this._id) {
      //check if _id is set then update the prosuct
      //Update the product
      dbOp = db //connection to database
      //2.collection
        .collection("products")
        //updateOne takes two argument,
        //1st - we add filter that defines which elemnt or document we want to update
        //2nd - specify how to  update that doucment, its a js object where we describe the update
        //id will not be overwritten
        // $set - it will update the the values of the document in the database with new values
        .updateOne({ _id: this._id }, { $set: this }); //searching for id that matches the id we have in product
    } else {
      dbOp =  db
      .collection("products")
      .insertOne(this) // insertOne because we want to insert only one product,
      //it only takes the object we want to insert, here we want to insert "product" we use this
    }

    //2.collection and document
    //here we can call collection to tell mogodb into which collection we want to insert something
    return (dbOp 

      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.log(err);
      }));
  }

  //get product in products page
  static fetchAll() {
    const db = getDb(); //acessing db

    return (
      db
        .collection("products")
        .find() //find doesnt retirn a prommise instead it returns a cursor
        // cursor is a object  provided by mongodb which allows us to go through our elements
        // find gives us a handle which we can use to tell mdb to give the next document
        // there's toArray method -- to get all documents and turn them into js array (used only when we have some documents  otherwise we use pagination)
        .toArray() //this returns a promise
        .then((products) => {
          console.log(products);
          return products;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  static findbyId(prodId) {
    const db = getDb();
    return db
      .collection("products")
    // ObjectID to create unique identifiers for all the documents in the database.
      .find({ _id: new mongodb.ObjectId(prodId) }) //here we create a new objectId to which we pass a string which will be wrapped by that
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  //static keyword defines a static method,
  //static methods are functions to create or clone objects
  static deleteById(prodId) {
    const db = getDb();
    return db.collection('products').deleteOne({_id: new mongodb.ObjectId(prodId) })
    .then(result => {
      console.log("Deleted");
    })
    .catch(err => {
      console.log(err);
    })

  }
}

//get products by adidng static method

module.exports = Product;
