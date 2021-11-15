const express = require("express");
//express validator is made up of sub package
//check is subpackage -- used for all the validation logic which we want to add
// const expValidator = require('express-validator/check');

// we get check function from  'express-validator/check' package
const { check, body } = require("express-validator");

const authController = require("../controllers/auth");
const router = express.Router();

const User = require("../models/user");

router.get("/login", authController.getLogin);

router.post(
  "/login",

  [
    body("email")
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .normalizeEmail(),
    body("password", "Password has to be valid.")
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim()
  ],

  authController.postLogin
);

router.post("/logout", authController.postLogout);

router.get("/signup", authController.getSignup);

//after path we can add as mansy middleware we want
//here we add check function it returns a midlleware
//check([]) -- in check functgion we enter an array of field we wabt to chek or just the fiels name
//check('email') -- this tell the express-validator that we are interstd in validating email value

//isEmail -- checks if the mail is valid or not
router.post(
  "/signup",
  [
    check("email")
      .isEmail() // isEmail() is method is called we then return a middleware
      //isemail -- looks for email in body , qury parameters,,in the header, in th ecookies and then checks if that is vali demail address

      .withMessage("Please enter a valid email")

      //checking for specific email we want to add
      .custom((value, { req }) => {
        // if (value === "test@test.com") {
        //   throw new Error("This email adress is forbidden.");
        // }
        // return true;
        return User.findOne({ email: value }) //value will be th entered email
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject("E-mail already exists");
            }
          });
      })
      .normalizeEmail(),
    body(
      "password",
      "Please enter a password with only numbbers and etxt and at least 5 characters"
    )
      .isLength({ min: 5 })
      .isAlphanumeric()
      .trim(),

    body("confirmPassword").trim().custom((value, { req }) => {
      //we are not adding islength and alpha numeric to confirm passwors
      //but we are checking it in main password and then we are cheking for equality

      if (value !== req.body.password) {
        throw new Error("Password have to match");
      }
      return true;
    }),
  ],
  authController.postSignup
);
router.get("/reset", authController.getReset);

router.post("/reset", authController.postReset);

router.get("/reset/:token", authController.getNewPassword);

router.post("/new-password", authController.postNewPassword);

module.exports = router;
