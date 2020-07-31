const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

const rootdir = require('./utils/path');
const User = require('./models/user');

const app = express();

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const error404Route = require('./controllers/error');

const PORT = 3000;

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(rootdir, 'public')));

// Middleware
app.use((req, res, next) => {
  User.findById('5f2399ec332e0b4b4c3fe1ae')
    .then((user) => {
      req.user = user;
      // console.log(req.user);
      next();
    })
    .catch((err) => console.log(err));
});

// ROUTES
app.use('/admin', adminRoute);
app.use(shopRoute);
// error route
app.use(error404Route.get404);

// DB connect and server start
mongoose
  .connect(
    'mongodb+srv://anagh:onineshop1024@onlineshop.ksyr2.mongodb.net/shop?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log(err);
    }
  )
  .then(() => {
    console.log('MongoDB connected...');

    // // Create user
    // const user = new User({
    //   name: 'Anagh',
    //   email: 'anagh@test.com',
    //   cart: {
    //     items: [],
    //   },
    // });
    // user.save();

    // Initialize server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));
