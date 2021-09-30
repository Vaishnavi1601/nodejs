const path = require("path");

const express = require("express");

const rootDir = require("../util/path");

//importing Router
const router = express.Router(); //express object has a Router() method that creates a new router object.

// executed for get request
router.get("/add-product", (req, res, next) => {
  res.sendFile(path.join(rootDir, "views", "add-product.html")); //send allows us to send our response
});

// executed for post request
router.post("/add-product", (req, res, next) => {
  console.log(req.body);
  res.redirect("/"); //redirect to / route
});

module.exports = router;
