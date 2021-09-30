const path = require('path');  //importing path core module

const express = require("express");

const rootDir = require('../util/path');

const router = express.Router();

router.get("/", (req, res, next) => {
//   console.log("In second mw");

  res.sendFile(path.join(rootDir,'views','shop.html')) //send back a file to the user, join returns the path by concatenating different segment
});

module.exports = router;
