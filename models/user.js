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
    // console.log(23,product);
    //here we get  the product we want to add to cart
    //findIndex method returns the index of the first element in the array
    const cartProductIndex = this.cart.items.findIndex;
    // console.log(26,cartProductIndex);
    //check if product already in cart
    //function that will be executed for every elemts in an item array
    //cp --{ productId: new ObjectId("6162806e20e03de7a918a986"), quantity: 1 }
    (cp =>{
    // console.log(29,cp);
    //return true if found right product in items array
     //we are storing productid in items in cart
    
    // return cp.productId === product._id; //this will return true if it match by both value and type  //product._id is not string 

    return cp.productId.toString() === product._id.toString();
    //then we know that product already exists in the cart
    //we need to add quantity for that

     });

     let newQuantity = 1;
    
     const updatedCartItems = [...this.cart.items];//storing all the cart items to updatedacrtiTems
     //so updatedCartItems gives us array of all the items in the cart
     //and we can now edit the old array without modifyimg the old array(js-reference and primitive type)
     //findout if cart contains certain product already
    
     //updatedCart will create an object whoch holds an items property which is array of only one product
    
    //updating the quantity of item if it already exist
    if (cartProductIndex >=0){
      newQuantity = this.cart.items[cartProductIndex].quantity +1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    
    }
    //adding new item to the cart
    else{
      updatedCartItems.push({productId: new ObjectId(product._id), quantity: newQuantity })
    }
    
   //here we have updated cart either with quantity increased or with new item added to cart
    const updatedCart = {items: updatedCartItems};
    //ans saving updatedcart to the database with all updated items
    const db = getDb(); //aceessing db

    //update the user to store that updatedCart
    //update the user to add a rpoduct to the cart
    return db
      .collection("users") // users collection
      .updateOne(
        // update one user there , with user id 
        { _id: new ObjectId(this._id) }, //finding _id 
        //and if we find that id we need to describe how to upadte
        //we use $set , where we pass an object that holds info about which field to update in which way
        //here cart which have user in db will receive updated cart
        //so updatedCart will overwrite the old cart with new cart
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
}

module.exports = User;
