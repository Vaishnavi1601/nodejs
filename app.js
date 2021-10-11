const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose"); //importing mongoose

const errorController = require("./controllers/error");
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
  User.findById("6164101e7fff168bcdcf08ea")
    .then((user) => {
      // console.log(25,user);
      // req.user = user; //when finding a user we store it in a request(req.user)
      // console.log(27,req.user); // usernwhich is stored here will be object with the properties we have in database
      // all methods of the user model will not be there,
      //bcz the user which are getting is of the databse ,
      // and methods aren't stored there

      //So..to have a real user object with which we can interact,
      //we create a new user which allow us to work with whole user model and also with all the methods in user model
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

//setting up connection with monggose
mongoose
  .connect(
    "mongodb+srv://vaishnavi123:vaishnavi123@cluster0.7veks.mongodb.net/shop?retryWrites=true&w=majority"
  )
  .then((result) => {
    User.findOne().then((user) => {
      if (!user) {

        //creating new user 
        const user = new User({
          name: "vaishnavi",
          email: "vaishnavi7734@gmail.com",
          cart: {
            items: [],
          },
        });

        //this will be done when we start server
        user.save();
      }
    });
  app.listen(3000);
  })
  .catch((err) => {
    console.log(err);
  });
