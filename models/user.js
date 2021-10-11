const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
          //productId will store an dobjectid bcz it will store a reference to product
        productId: { type: Schema.Types.ObjectId, required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});


module.exports = mongoose.model('User', userSchema)
// const mongodb = require("mongodb");
// const getDb = require("../util/database").getDb;

// const ObjectId = mongodb.ObjectId;

// //creating user
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart; // cart is object with  array of  items {items: []}
//     this._id = id;
//   }

//   //saving user to db
//   save() {
//     const db = getDb(); //storing db client in db cosntant
//     //on that client we can create a collection
//     return db.collection("users").insertOne(this);
//   }

//   addToCart(product) {
//     // console.log(23,product);
//     //here we get  the product we want to add to cart
//     //findIndex method returns the index of the first element in the array
//     const cartProductIndex = this.cart.items.findIndex
//     // console.log(26,cartProductIndex);
//     //check if product already in cart
//     //function that will be executed for every elemts in an item array
//     //cp --{ productId: new ObjectId("6162806e20e03de7a918a986"), quantity: 1 }
//     (cp => {
//       // console.log(29,cp);
//       //return true if found right product in items array
//       //we are storing productid in items in cart

//       // return cp.productId === product._id; //this will return true if it match by both value and type  //product._id is not string

//       return cp.productId.toString() === product._id.toString();
//       //then we know that product already exists in the cart
//       //we need to add quantity for that
//     });

//     let newQuantity = 1;

//     const updatedCartItems = [...this.cart.items]; //storing all the cart items to updatedacrtiTems
//     //so updatedCartItems gives us array of all the items in the cart
//     //and we can now edit the old array without modifyimg the old array(js-reference and primitive type)
//     //findout if cart contains certain product already

//     //updatedCart will create an object whoch holds an items property which is array of only one product

//     //updating the quantity of item if it already exist
//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     }
//     //adding new item to the cart
//     else {
//       updatedCartItems.push({
//         //we are storing id of every product in the cart
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     //here we have updated cart either with quantity increased or with new item added to cart
//     const updatedCart = { items: updatedCartItems };
//     //ans saving updatedcart to the database with all updated items
//     const db = getDb(); //aceessing db

//     //update the user to store that updatedCart
//     //update the user to add a rpoduct to the cart
//     return db
//       .collection("users") // users collection
//       .updateOne(
//         // update one user there , with user id
//         { _id: new ObjectId(this._id) }, //finding _id
//         //and if we find that id we need to describe how to upadte
//         //we use $set , where we pass an object that holds info about which field to update in which way
//         //here cart which have user in db will receive updated cart
//         //so updatedCart will overwrite the old cart with new cart
//         { $set: { cart: updatedCart } }
//       );
//   }
//   //getcart exist only for user who hascart property
//   getCart() {
//     // return this.cart; //this give us access to user cart
//     const db = getDb();

//     //this.cart.item -- object having productid and quantity

//     const productIds = this.cart.items.map((i) => {
//       //mapping array of  items(object) TO array of productId(string) and storing in new productIds
//       return i.productId;
//     });

//     return (
//       db
//         .collection("products")
//         //we need to find all products that are in cart
//         // for that we use "query synatx"
//         //$in -- query operator , it takes an array of ids

//         .find({ _id: { $in: productIds } }) //this returns a cursor with all the matching product
//         .toArray()
//         //in this then method, we have all product data for the products that were in cart.
//         .then((products) => {
//           //array of products from database
//           return products.map((p) => {
//             //here map method have function which will
//             //return new object for every product with all the existing property and added quantity property
//             return {
//               ...p,
//               quantity: this.cart.items.find((i) => {
//                 // finding item with the id in ...p
//                 //so now we will have cart item and
//                 //return true if that item has a productid that is equal to product_id of the product we fetched from database
//                 return i.productId.toString() === p._id.toString();
//               }).quantity, //the find method returns a product object //extracting quantity from cart items
//             };
//           });
//         })
//     );
//     // and therefore for every id which is in array  will be accepted and will get a cursor which holds reference to all products with one of the Ids mentioned in this array
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       // filter runs on every element(item) in the items
//       //and we return true if we want to keep that item in array and false if we want to get rid of it
//       //
//       //filter allow us to define a criteria on how we want to filter the elemnts in array
//       return item.productId.toString() !== productId.toString(); //this should return false for deleting
//     });

//     const db = getDb();

//     //this will update the
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }
//   //add orders to users
//   addOrder() {
//     const db = getDb();
//     return this.getCart() //here we will get updated products
//       .then((products) => {
//         //this product will have all the information along with the quantity

//         //adding cart products and user id name to order object
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.name,
//           },
//         };
//         //inserting order into orders collection
//         return db.collection("orders").insertOne(order); //inserting cart items to orders collection before clearing it
//       })

//       .then((result) => {
//         this.cart = { items: [] }; //empty cart in user object
//         return (
//           db
//             .collection("users")
//             //search for user and set the cart to an empty array
//             .updateOne(
//               { _id: new ObjectId(this._id) },
//               { $set: { cart: { items: [] } } } //setting cart empty in db
//             )
//         );
//       });
//   }

//   getOrders() {
//     const db = getDb();
//     return db
//       .collection("orders")
//       .find({ "user._id": new ObjectId(this._id) })
//       .toArray();
//   }

//   //finding user by userId
//   static findById(userId) {
//     console.log(userId);
//     const db = getDb();
//     return db
//       .collection("users")
//       .findOne({ _id: mongodb.ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   }
// }

// module.exports = User;
