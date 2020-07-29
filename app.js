const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');

const rootdir = require('./utils/path');
const dbconnect = require('./utils/database').dbconnect;
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
  User.findById('5f213c65e677a84d101be0bc')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
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

dbconnect(() => {
  // console.log(client);
  console.log('MongoDB connected...');
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
});
