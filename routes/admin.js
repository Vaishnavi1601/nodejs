const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router(); //importing Router, express object has a Router() method, creates a new router object.

const products = [];

// executed for get request
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path:"/admin/add-product",
  });
}); //render method provided by express, it will use default templating engine(ejs) and return that template,

// executed for post request
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title }); //extracting title
  res.redirect("/"); //redirect to / route
});

exports.routes = router;
exports.products = products;
