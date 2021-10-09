const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");

const errorController = require("./controllers/error");
const mongoConnect = require("./util/database"); // importing function

const app = express();

app.set("view engine", "ejs");
app.set("views", "views");

const adminRoutes = require("./routes/admin");
// const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  //rech out to DB and  retrieve user with userid 1
  // User.findByPk(1)
  //   .then((user) => {
  //     req.user = user; //adding new field to request object -- sequelize object
  //     next();
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
});

app.use("/admin", adminRoutes);
// app.use(shopRoutes);

app.use(errorController.get404);

//this will get executed once we connect
mongoConnect(() => {
  //once we are connected to db we listen to server
  app.listen(3000);
});
