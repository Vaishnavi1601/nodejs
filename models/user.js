const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

const ObjectId = mongodb.ObjectId;

//creating user
class User {
  constructor(username, email, cart,id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // cart is object with  array of  items {items: []}
    this._id = id;
  }

  //saving user to db
  save() {
    const db = getDb(); //storing db client in db cosntant
    //on that client we can create a collection
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    //here we get  the product we want to add to cart
    // const cartProduct = this.cart.items.findIndex
    //function that will be executed for every elemts in an item array
    //cp is the product item in th eitem array
    //(cp =>{
    //return trur if found right product in items array
    //   return cp._id === product._id;
    //then we know that product already exists in the cart
    //and then we need to add quantity for that

    // });

    //finout if cart contains certain product already

    //firstky we assume there are no prduct sin the cxart
    //so  we are adding product here w/o checking if product already exists

    //updatedCart -- an object where we have items property which is an an array
    //and will include product also the quantity

    //...product -- pull out all the properties of product object and adding a new property i.e quantity:1

    //updatedCart will create an object whoch holds an items property which is array of only one product
    const updatedCart = { items: [{productId: new ObjectId(product._id), quantity: 1 }] };
    const db = getDb(); //aceessing db

    //update the user to store that updatedCart
    //update the user to add a rpoduct to the cart
    return db
      .collection("users") // users collection
      .updateOne(
        // update one user there , with user id line 53
        { _id: new ObjectId(this._id) }, //finding _id 
        //and if we find that id we need to describe how to upadte
        //we use $set , where we pass an object that holds info about which field to update in which way
        //here cart which have user in db will receive updated cart
        // so updatedCart will overwrite the old cart with new cart
        { $set: { cart: updatedCart } }
      );
  }

  //finding user by userId
  static findById(userId) {
    console.log(userId);
    const db = getDb();
    return (
      db
        .collection("users")
        // .find({_id: new mongodb.ObjectId(userId)})
        // .next()
        .findOne({ _id: mongodb.ObjectId(userId) })
        .then((user) => {
          console.log(user);
          return user;
        })
        .catch((err) => {
          console.log(err);
        })
    );
  }

  // static findbyId(userId) {
  //   const db = getDb();
  //   return db.collection('users').findOne({_id: mongodb.ObjectId(userId)});
  // }
}

module.exports = User;
