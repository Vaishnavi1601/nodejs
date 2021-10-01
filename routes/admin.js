const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

const router = express.Router(); //importing Router, express object has a Router() method, creates a new router object.

const products = [];

// executed for get request
router.get("/add-product", (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
  });
  // res.sendFile(path.join(rootDir, "views", "add-product.html")); //send allows us to send our response
});

// executed for post request
router.post("/add-product", (req, res, next) => {
  products.push({ title: req.body.title }); //extracting title
  res.redirect("/"); //redirect to / route
});

exports.routes = router;
exports.products = products;
