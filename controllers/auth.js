const bcrypt = require('bcryptjs');

const User = require('../models/user');

exports.getLogin = (req, res) => {
  let errorMsg = req.flash('loginError');
  if (errorMsg.length === 0) errorMsg = null;
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    errorMsg: errorMsg,
  });
};

exports.postLogin = (req, res) => {
  // Extract from req.body
  const { email, password } = req.body;

  // Find matching user
  User.findOne({ email: email })
    .then((user) => {
      // Compare user password with entered password
      if (!user) return res.redirect('/login');
      bcrypt
        .compare(password, user.password)
        .then((matched) => {
          if (matched) {
            // Store session data
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save((err) => {
              if (err) console.log(err);
              res.redirect('/');
            });
          } else {
            req.flash('loginError', 'Invalid email or password');
            console.log('Password mismatch');
            res.redirect('/login');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => console.log(err));
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res) => {
  let errorMsg = req.flash('signUpError');
  if (errorMsg.length === 0) errorMsg = null;
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    isLoggedIn: false,
    errorMsg: errorMsg,
  });
};

exports.postSignup = (req, res) => {
  const { name, email, password, confirmPassword } = req.body;
  User.findOne({ email: email })
    .then((user) => {
      if (user) {
        req.flash('signUpError', 'Email already exists');
        return res.redirect('/signup');
      }
      return bcrypt
        .hash(password, 12)
        .then((pass) => {
          const newUser = new User({
            name: name,
            email: email,
            password: pass,
            cart: { items: [] },
          });
          return newUser.save();
        })
        .then((result) => {
          res.redirect('/login');
        });
    })
    .catch((err) => console.log(err));
};
