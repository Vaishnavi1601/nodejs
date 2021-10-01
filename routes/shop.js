const path = require("path"); //importing path core module

const express = require("express");

const rootDir = require("../util/path");
const adminData = require('./admin');

const router = express.Router(); //express object has a Router() method that creates a new router object.

router.get("/", (req, res, next) => {

  const products= adminData.products;


  // console.log(adminData.products);
  // res.sendFile(path.join(rootDir, "views", "shop.html")); //send back a file to the user, join returns the path by concatenating different segment
  
  //products data is passed into shop template.
  res.render('shop',{prods:products, pageTitle:'My Shop',path:'/'}) //method provided by express, it will use default templating engine and return that template, 
                                      //allows us to pass data that should be added in our view


});

module.exports = router;
