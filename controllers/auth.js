const crypto = require("crypto"); //built in library, helps in creating secure random values
const bcrypt = require("bcryptjs");
const mailgun = require("mailgun-js");
//importing validation result -- i.e function that allows us to gather all the errors
const { validationResult } = require("express-validator");

const {DOMAIN, API_KEY } = require('../private/api')

const User = require("../models/user");

const mg = mailgun({
  apiKey: API_KEY,
  domain: DOMAIN,
});

const data = {
  from: "vaishujais1601@gmail.com",
  to: "vaishnavi7734@gmail.com",
  subject: "Signup succeeded",
  text: "You have successfully signed up",
};

exports.getLogin = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    //error Message will be set and will hold a value only if we haev an error flashed into our session

    errorMessage: message,
    oldInput: {
      email: '',
      password: ''
    },
    validationErrors: []
  });
};

exports.getSignup = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    errorMessage: message,
    oldInput: {
      email: '',
      password: '',
      confirmPassword: ''
    },
    validationErrors: [] //empty array if we get no errors

  });
};

// exports.postLogin = (req, res, next) => {
//   const email = req.body.email;
//   const password = req.body.password;
//   User.findOne({ email: email })
//     .then((user) => {
//       if (!user) {
//         return res.redirect("/login");
//       }
//       //if we have the user then ew cam check the password next
//       bcrypt
//         .compare(password, user.password)
//         .then((doMatch) => {
//           if (doMatch) {
//             req.session.isLoggedIn = true;
//             req.session.user = user;
//             return req.session.save((err) => {
//               console.log(err);
//               res.redirect("/");
//             });
//           }
//           res.redirect("/login");
//         })
//         .catch((err) => console.log(err));
//       res.redirect("/login");
//     })

//     .catch((err) => console.log(err));
// };

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/login", {
      path: "/login",
      pageTitle: "Login",
      errorMessage: errors.array()[0].msg,
      oldInput: {
        email: email,
        password: password,
      },
      validationErrors:errors.array()
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).render("auth/login", {
          path: "/login",
          pageTitle: "login",
          errorMessage: 'Invalid email or password',
          oldInput: {
            email: email,
            password: password,
          },
          validationErrors:[] 
        });
      }
      bcrypt
        .compare(password, user.password)
        .then((doMatch) => {
          console.log("doMatch", doMatch);
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            console.log("req.session", req.session);
            return req.session.save((err) => {
              console.log(err);
              res.redirect("/");
            });
          }

          return res.status(422).render("auth/login", {
            path: "/login",
            pageTitle: "login",
            errorMessage: 'Invalid email or password',
            oldInput: {
              email: email,
              password: password,
            },
            validationErrors:[]
          })
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};

//storing new user in db
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    return res.status(422).render("auth/signup", {
      path: "/signup",
      pageTitle: "Signup",
      errorMessage: errors.array()[0].msg,
      //when we have invalid input we get these value back in our view
      oldInput: {
        email: email,
        password: password,
        confirmPassword: req.body.confirmPassword
      },
      validationErrors: errors.array() //returninng full array of errors
    });
  }
  const data = {
    from: "vaishujais1601@gmail.com",
    to: "vaishnavi7734@gmail.com",
    subject: "Signup succeeded",
    text: "You have successfully signed up",
  };

  //.hash will first take the string which we want to hash
  // second argumrnt is salt value  which will specify how many rounds of hashing will be applied

  bcrypt
    .hash(password, 12)
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};

exports.getReset = (req, res, next) => {
  let message = req.flash("error");
  if (message.length > 0) {
    message = message[0];
  } else {
    message = null;
  }
  res.render("auth/reset", {
    path: "/reset",
    pageTitle: "Reset Password",
    errorMessage: message,
  });
};

exports.postReset = (req, res, next) => {
  //to generate random byte
  //secnd is the callback funcxtion which is executed once byte is generated
  //either we get error buffer value of 32 byte
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      return res.redirect("/reset");
    }
    //buffer will store hexadecimal value so  and that needdss to be converted to normal ASCII characters
    //generating token from buffer
    const token = buffer.toString("hex");
    console.log(12, token);

    const data = {
      from: "vaishujais1601@gmail.com",
      to: "vaishnavi7734@gmail.com", //sending mail to user we are requesting the reset
      subject: "Password Reset",
      text: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset/${token}">Link</a> to set a new password.</p>
      `,
    };
    //checking if email matches the email we are trying to reset
    //finding user who has thatemail
    User.findOne({ email: "vaishnavi7734@gmail.com" })
      .then((user) => {
        console.log(201, user);
        if (!user) {
          req.flash("error", "No account with that email found.");
          return res.redirect("/reset");
        } //if this is true then we are lookin for email that is tsored in database
        // and for that user set the resetToken

        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000; //(current date and time + 1 hr)

        return user.save();
      })
      //this then block will exexute if user save succeeds
      .then((result) => {
        mg.messages().send(data, function (error, body) {
          console.log(11, body, data);
        });
        res.redirect("/");
      })
      .catch((err) => {
        const error = new Error(err);
        error.httpStatusCode = 500;
        return next(error); 
      });
  });
};

exports.getNewPassword = (req, res, next) => {
  const token = req.params.token;
  //checking if the token matches the token
  //and expiration time is greater then the current time
  User.findOne({ resetToken: token, resetTokenExpiration: { $gt: Date.now() } })
    .then((user) => {
      let message = req.flash("error");
      if (message.length > 0) {
        message = message[0];
      } else {
        message = null;
      }
      res.render("auth/new-password", {
        path: "/new-password",
        pageTitle: "New Password",
        errorMessage: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};

exports.postNewPassword = (req, res, next) => {
  const newPassword = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;
  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      resetUser = user;
      return bcrypt.hash(newPassword, 12);
    })
    .then((hashedPassword) => {
      resetUser.password = hashedPassword;
      resetUser.resetToken = undefined;
      resetUser.resetTokenExpiration = undefined;
      return resetUser.save();
    })
    .then((result) => {
      res.redirect("/login");
    })
    .catch((err) => {
      const error = new Error(err);
      error.httpStatusCode = 500;
      return next(error); 
    });
};
