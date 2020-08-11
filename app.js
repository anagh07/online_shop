const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const rootdir = require('./utils/path');
const User = require('./models/user');
const KEYS = require('./config/keys');
const passDataToViews = require('./middlewares/passDataToViews');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorRoute = require('./controllers/error');

const PORT = 3000;

const app = express();
const csrfProtection = csrf();

// Set view engine and static folder
app.set('view engine', 'ejs');
app.set('views', 'views');

// Use express bodyparser
app.use(bodyparser.urlencoded({ extended: false }));

// Public folder for css and js
app.use(express.static(path.join(rootdir, 'public')));

// Initialize session store
const sessionStore = new MongoDBStore({
  uri: KEYS.MONGO_URI,
  collection: 'sessionStore',
});

// Create session and mention the store
app.use(
  session({
    secret: 'not a secret',
    resave: false,
    saveUninitialized: false,
    store: sessionStore,
  })
);
// Extract user model from session
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user;
      next();
    })
    .catch((err) => {
      throw new Error(err);
    });
});

// Middleware
app.use(csrfProtection);
app.use(passDataToViews);
app.use(flash());

// ROUTES
app.use('/admin', adminRoute);
app.use(shopRoute);
app.use(authRoute);
// error route
app.get('/500', errorRoute.get500);
app.use(errorRoute.get404);

// Server errors
app.use((error, req, res, next) => {
  console.log(error);
  res.redirect('/500');
});

// DB connect and server start
mongoose
  .connect(
    KEYS.MONGO_URI,
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log(err);
    }
  )
  .then(() => {
    console.log('MongoDB connected...');

    // Initialize server
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch((err) => console.log(err));
