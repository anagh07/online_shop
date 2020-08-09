const bcrypt = require('bcryptjs');
const sgMail = require('@sendgrid/mail');
const crypto = require('crypto');
const { validationResult } = require('express-validator');

const User = require('../models/user');
// const signupEmail = require('../data/email').signupEmail;
const {
  signupEmail,
  resetPasswordEmail,
  resetSuccessEmail,
} = require('../data/email');

sgMail.setApiKey(
  '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'
);

exports.getLogin = (req, res) => {
  let errorMsg = req.flash('error');
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
            req.flash('error', 'Invalid email or password');
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
  const error = validationResult(req);
  if (!error.isEmpty()) {
    console.log(error);
    return res.status(422).render('auth/signup', {
      path: '/signup',
      pageTitle: 'signup',
      isLoggedIn: false,
      errorMsg: error,
    });
  }
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
          sgMail.send(signupEmail(email));
        });
    })
    .catch((err) => console.log(err));
};

exports.getResetPassword = (req, res) => {
  let errorMsg = req.flash('errorNoAccount');
  if (errorMsg.length === 0) errorMsg = null;
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: '/reset-password',
    errorMsg: errorMsg,
  });
};

exports.postResetPassword = (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
      return res.redirect('/reset-password');
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          req.flash(
            'errorNoAccount',
            'No account found for the email you entered!'
          );
          return res.redirect('/reset-password');
        }
        user.resetToken = token;
        user.resetTokenExpiry = Date.now() + 3600000;
        return user.save();
      })
      .then((result) => {
        req.flash(
          'resetPasswordEmailSent',
          'An email containing the link to resetting your password has been sent to your email.'
        );
        res.redirect('/');
        sgMail.send(resetPasswordEmail(req.body.email, token));
      })
      .catch((err) => console.log(err));
  });
};

exports.getNewPassword = (req, res) => {
  const token = req.params.token;
  User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() },
  })
    .then((user) => {
      let message = req.flash('error');
      message = message.length == 0 ? null : message;
      res.render('auth/new-password', {
        pageTitle: 'New Password',
        path: '/new-password',
        errorMsg: message,
        userId: user._id.toString(),
        passwordToken: token,
      });
    })
    .catch((err) => console.log(err));
};

exports.postNewPassword = (req, res) => {
  const userId = req.body.userId;
  const password = req.body.newpassword;
  const confirmPassword = req.body.confirmpassword;
  const passwordToken = req.body.passwordToken;
  let updatedUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiry: { $gt: Date.now() },
    _id: userId,
  })
    .then((user) => {
      if (!user) {
        req.flash('error', 'Expired token');
        return res.redirect('/login');
      }
      updatedUser = user;
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      updatedUser.password = hashedPassword;
      updatedUser.resetToken = undefined;
      updatedUser.resetTokenExpiry = undefined;
      return updatedUser.save();
    })
    .then((result) => {
      res.redirect('/login');
      sgMail.send(resetSuccessEmail(updatedUser.email));
    })
    .catch((err) => console.log(err));
};
