const User = require('../models/user');

exports.getLogin = (req, res) => {
  console.log(req.session.isLoggedIn);
  res.render('auth/login', {
    pageTitle: 'Login',
    path: '/login',
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postLogin = (req, res) => {
  User.findById('5f2399ec332e0b4b4c3fe1ae')
    .then((user) => {
      // Successful login
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.user.save((err) => {
        if (err) console.log(err);
        res.redirect('/');
      });
    })
    .catch((err) => console.log(err));

  // res.setHeader('Set-Cookie', 'loggedIn=true');
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.log(err);
    res.redirect('/');
  });
};

exports.getSignup = (req, res) => {
  res.render('auth/signup', {
    path: '/signup',
    pageTitle: 'signup',
    isLoggedIn: false,
  });
};

exports.postSignup = (req, res) => {};
