const express = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const fs = require('fs');
const env = require('dotenv');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');

const rootdir = require('./utils/path');
const User = require('./models/user');
const passDataToViews = require('./middlewares/passDataToViews');

const adminRoute = require('./routes/admin');
const shopRoute = require('./routes/shop');
const authRoute = require('./routes/auth');
const errorRoute = require('./controllers/error');

// Environment variables
env.config({ path: './config.env' });
// env.config({ path: './config/email.env' });
const PORT = process.env.PORT;
console.log(process.env.NODE_ENV);

const app = express();
const csrfProtection = csrf();

// Set view engine and static folder
app.set('view engine', 'ejs');
app.set('views', 'views');

// Public (static) folder for files, css and js
app.use(express.static(path.join(rootdir, 'public')));
app.use('/temp/images', express.static(path.join(rootdir, 'temp/images')));

// Parsers
app.use(bodyparser.urlencoded({ extended: false }));

// File parser
const fileStore = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './temp/images');
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
   },
});
const fileFilter = (req, file, cb) => {
   if (
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/jpg' ||
      file.mimetype === 'image/jpeg'
   ) {
      cb(null, true);
   } else {
      cb(null, false);
   }
};
app.use(
   multer({ storage: fileStore, fileFilter: fileFilter }).single('imagefile')
);

// Initialize session store
const sessionStore = new MongoDBStore({
   uri: process.env.MONGO_URI,
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
app.use(helmet());
app.use(compression());
const morganLogStream = fs.createWriteStream(
   path.join(__dirname, 'accessLog.log'),
   { flags: 'a' }
);
app.use(morgan('combined', { stream: morganLogStream }));

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
      process.env.MONGO_URI,
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
