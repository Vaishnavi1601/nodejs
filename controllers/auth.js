const bcrypt = require("bcryptjs");
const mailgun = require('mailgun-js')

const User = require("../models/user");

const DOMAIN = 'sandbox5cb078d1be55467fa0817586117c0828.mailgun.org';
const mg = mailgun({apiKey: '785ef27c7bf6dff8b0d7b3f626a3a507-2bf328a5-b5e0f3dc', domain: DOMAIN});
const data = {
	from: 'vaishujais1601@gmail.com',
	to: 'vaishnavi7734@gmail.com',
	subject: 'Signup succeeded',
	text: 'You have successfully signed up'
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
    .then((user) => {
      if (!user) {
        req.flash("error", "Invalid email or password");
        return res.redirect("/login");
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
          // res.redirect('/login');
        })
        .catch((err) => {
          console.log(err);
          res.redirect("/login");
        });
    })
    .catch((err) => console.log(err));
};

//storing new user in db
exports.postSignup = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  const data = {
    from: 'vaishujais1601@gmail.com',
    to: 'vaishnavi7734@gmail.com',
    subject: 'Signup succeeded',
    text: 'You have successfully signed up'
  };

  //check if user already exist if not create new user
  User.findOne({ email: email })
    .then((userDoc) => {
      if (userDoc) {
        req.flash("error", "E-mail already exists");
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

      return user.save();
    })
    .then((result) => {
      res.redirect("/login");
      mg.messages().send(data, function (error, body) {
        console.log(body);
      });
      
    })
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
