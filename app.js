const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session); //this gives us function whixh should execute to which we pass our session
const csrf = require("csurf");
const flash = require("connect-flash");
const multer = require("multer");

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

const csrfProtection = csrf();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString().replace(/:/g, '-')+ "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  }
   else {
    cb(null, false);
  }
};

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");

app.use(bodyParser.urlencoded({ extended: false }));

app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")); //single -- only ione file


//serving folder statically means requet to file in that folder eill be handled automatically and files will be returned

app.use(express.static(path.join(__dirname, "public")));
app.use('/images', express.static(path.join(__dirname, "images")));

//intializing session middleware
//configuring session setup in object
//secret -- used for signing the hash which secretly stores our ID in the cookie
// resave:false-- means thaht the session will not be saved on every request that is done
//saveUninitialized:false -- it ensures that no sessions gets saved for a request where it doesnt need to be saved
app.use(
  session({
    secret: "my secret", //key that will sign the cookies
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use((req, res, next) => {
  //in case of sync code outside of callback and promises -- when we throw an error express will detect this and
  //-- will execute the next error handling middleware

  // throw new Error("Sync Dummy");

  //checking we have session user or not
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      //1. dummy error is thrown in then block it will prevent reaching from error handling middleware
      // throw new Error("Dummy");
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })

    //2. hence catch block exexcutes
    //3. thfre next(new Error(err)); is executed
    .catch((err) => {
      //wrapping the error inside next in async code
      next(new Error(err));
    });
});

app.use("/admin", adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.get("/500", errorController.get500);

app.use(errorController.get404);

//error handling middleware
app.use((error, req, res, next) => {
  res.status(500).render("500", {
    pageTitle: "Error",
    path: "/500",
    isAuthenticated: req.session.isLoggedIn,
  });
});

mongoose
  .connect(MONGODB_URI, { useUnifiedTopology: true, useNewUrlParser: true })
  .then((result) => {
    app.listen(3000);
    console.log("CONNECTED at port 3000");
  })
  .catch((err) => {
    console.log(err);
  });
