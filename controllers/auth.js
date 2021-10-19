const bcrypt = require("bcryptjs");

const User = require("../models/user");

exports.getLogin = (req, res, next) => {
  res.render("auth/login", {
    path: "/login",
    pageTitle: "Login",
    isAuthenticated: false,
  });
};

exports.getSignup = (req, res, next) => {
  res.render("auth/signup", {
    path: "/signup",
    pageTitle: "Signup",
    isAuthenticated: false,
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
  User.findOne({ email: email })
    .then(user => {
      // console.log('user', user);
      if (!user) {
        return res.redirect('/login');
      }
      bcrypt
        .compare(password, user.password)
        .then(doMatch => {
          console.log('doMatch', doMatch);
          if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
           console.log('req.session', req.session);
            return req.session.save(err => {
              console.log(err);
              res.redirect('/');
            });
          }
          // res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
    })
    .catch(err => console.log(err));
};

//storing new user in db
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  //check if user already exist if not create new user
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        return res.redirect("/signup");
      }
      //.hash will first take the string which we want to hash
      // second argumrnt is salt value  which will specify how many rounds of hashing will be applied
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items: [] },
      });

      // return user.save();
      user.save().then((result) => {
        res.redirect("/login");
      });
    })

    // .then((result) => {
    //   res.redirect("/login");
    // })
    .catch((err) => {
      console.log(err);
    });
};

exports.postLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
