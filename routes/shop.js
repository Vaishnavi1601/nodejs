const path = require("path");
const express = require("express");

const rootDir = require("../util/path");
const adminData = require("./admin");

const router = express.Router(); //express object has a Router() method that creates a new router object.

router.get("/", (req, res, next) => {
  const products = adminData.products;
  //products data is passed into shop template.
  res.render("shop", {
    prods: products,
    pageTitle: "My Shop",
    path: "/",
    hasProducts: products.length > 0,
  }); //render method provided by express, it will use default templating engine(pug) and return that template,
  //allows us to pass data that should be added in our view
});
module.exports = router;
