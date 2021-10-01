const express = require("express"); //express is a node module
const bodyParser = require("body-parser");
const path = require("path");

const app = express(); //calling express function

app.set('view engine','pug') ;   //here we are telling express we want to compile dynamic template with pug engine
app.set('views','views');          //those templates are in views 

const adminData = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// use allows us to add a new middlware function
app.use(bodyParser.urlencoded({ extended: true })); // body parsing

app.use(express.static(path.join(__dirname, "public"))); // static--built-in middleware function

app.use("/admin", adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).render('404',{pageTitle:'Page Not Found'});
});

app.listen(3000);
