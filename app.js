const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const sequelize = require("./util/database"); //this is pool which allow us to use connection in it

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cart-item");
const Order = require("./models/order");
const OrderItem = require("./models/order-item");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  //rech out to DB and  retrieve user with userid 1
  User.findByPk(1) 
    .then((user) => {
      req.user = user; //adding new field to request object -- sequelize object
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);


//defing relations btwn our models
Product.belongsTo(User, { constraints: true, onDelete: "CASCADE" });  //user createed this product, cascade -- if we delete a product anything related to that product wiould also be gone
User.hasMany(Product);  // one user can add more than one product to the shop

User.hasOne(Cart);  //each user has only one cart
// Cart.belongsTo(User);  
Cart.belongsToMany(Product, { through: CartItem }); // one cart can hold multiple product
Product.belongsToMany(Cart, { through: CartItem });  // a single product can be part of multiple different cart

Order.belongsTo(User);//single order belongs to one user who palces the order
User.hasMany(Order); //user can have many order
Order.belongsToMany(Product, { through: OrderItem }); //

//this sets up our database
sequelize

//sync method is aware of all the models we define and it creates table for them,
//it syncs models to the database by creating app. tables
  .sync()
  .then((result) => {
    return User.findByPk(1); //check if user already exit with userId 1
  })
  .then((user) => {
    // if user doesnt exist create new user
    if (!user) {
      //creting new user
      return User.create({ name: "abc", email: "abc@gmail.com" });
    }
    return user; // if user already exist return the user
  })
  //creating cart for user
  .then((user) => {
    return user.createCart();
  })
  .then(cart =>{
    app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
