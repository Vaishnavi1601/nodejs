const express = require("express"); //express is a node module
const bodyParser = require("body-parser");
const path = require("path");

const app = express(); //calling express function
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

// use allows us to add a new middlware function
app.use(bodyParser.urlencoded({ extended: true })); // body parsing

app.use(express.static(path.join(__dirname, "public"))); // static--built-in middleware function

app.use("/admin", adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "views", "404.html"));
});

app.listen(3000);
