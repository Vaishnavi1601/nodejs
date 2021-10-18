const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //this gives us function whixh should execute to which we pass our session

const errorController = require("./controllers/error");
const User = require("./models/user");

const MONGODB_URI =
  "mongodb+srv://vaishnavi123:vaishnavi123@cluster0.7veks.mongodb.net/shop";

const app = express();

//store doesnt know aboout mongooese model so when it fetches data from db it only fetches data not objects and method
const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection: "sessions", //defining collection where sesion will be stored
});

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

//intializing session middleware
//configuring session setup in object
//secret -- used for signing the hash which secretly stores our ID in the cookie
// resave:false-- means thaht the session will not be saved on every request that is done
//saveUninitialized:false -- it ensures that no sessions gets saved for a request where it doesnt need to be saved
app.use(
  session({
    secret: "my secret",   //key that will sign the cookies
    resave: false,
    saveUninitialized:false,
    store: store,
  })
);

//storing our user in request
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      console.log(57, user);
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(3000);
    console.log("CONNECTED at port 3000");
  })
  .catch((err) => {
    console.log(err);
  });
