const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session');

const errorController = require('./controllers/error');
const User = require('./models/user');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

//intializing session middleware
//configuring session setup in object 
//secret -- used for signing the hash which secretly stores our ID in the cookie
// resave:false-- means thaht the session will not be saved on every request that is done
//saveUninitialized:false -- it ensures that no sessions gets saved for a request where it doesnt need to be saved
aap.use(session({secret: 'my secret', resave:false, saveUninitialized: false}))

app.use((req, res, next) => {
  User.findById('6164101e7fff168bcdcf08ea')
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
  .connect(
    'mongodb+srv://vaishnavi123:vaishnavi123@cluster0.7veks.mongodb.net/shop?retryWrites=true&w=majority'
  )
  .then(result => {
    User.findOne().then(user => {
      if (!user) {
        const user = new User({
          name: 'alexbob',
          email: 'max@test.com',
          cart: {
            items: []
          }
        });
        user.save();
      }
    });
    app.listen(3000);
    console.log('CONNECTED======')
  })
  .catch(err => {
    console.log(err);
  });
