const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database").mongoConnect; // importing function
const User = require("./models/user");

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

console.log("++++");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  //rech out to DB and  retrieve user with userid
  console.log(23, User);
  User.findById("61628506ea622e22df805643")
    .then((user) => {
      // console.log(25,user);
      // req.user = user; //when finding a user we store it in a request(req.user)
      // console.log(27,req.user); // usernwhich is stored here will be object with the properties we have in database
      // all methods of the user model will not be there,
      //bcz the user which are getting is of the databse ,
      // and methods aren't stored there

      //So..to have a real user object with which we can interact,
      //we create a new user which allow us to work with whole user model and also with all the methods in user model
      req.user = new User(user.name,user.email,user.cart,user._id);
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//this will get executed once we connect
mongoConnect(() => {
  //once we are connected to db we listen to server
  app.listen(3000);
});
