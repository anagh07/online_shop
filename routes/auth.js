const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const authController = require('../controllers/auth');
const User = require('../models/user');

// @METHOD  GET
// @ROUTE   /login
router.get('/login', authController.getLogin);

// @METHOD  POST
// @ROUTE   /login
router.post(
  '/login',
  [
    body('email', 'Invalid email or password.')
      .isEmail()
      .isLength({ min: 1 })
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (!user) {
            return Promise.reject('No existing user found with this email.');
          }
        });
      })
      .normalizeEmail()
      .trim(),
    body('password')
      .isLength({ min: 1 })
      .isAlphanumeric()
      .withMessage('Invalid email or password.')
      .trim(),
  ],
  authController.postLogin
);

// @METHOD  POST
// @ROUTE   /logout
router.post('/logout', authController.postLogout);

// @METHOD  GET
// @ROUTE   /signup
router.get('/signup', authController.getSignup);

// @METHOD  POST
// @ROUTE   /signup
router.post(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then((user) => {
          if (user) {
            return Promise.reject('Account already exists with this email!');
          }
        });
      })
      .normalizeEmail()
      .trim(),
    body(
      'password',
      'Passwords has to be min 5 characters, containing only numbers and text.'
    )
      .isAlphanumeric()
      .isLength({ min: 5, max: 30 })
      .trim(),
    body('name', 'Username cannot be empty.')
      .isAlphanumeric()
      .isLength({ min: 1 }),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password!');
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);

// @METHOD  GET
// @ROUTE   /reset-password
router.get('/reset-password', authController.getResetPassword);

// @METHOD  POST
// @ROUTE   /reset-password
router.post('/reset-password', authController.postResetPassword);

// @METHOD  GET
// @ROUTE   /reset-password/:token
router.get('/reset-password/:token', authController.getNewPassword);

// @METHOD  POST
// @ROUTE   /new-password
router.post('/new-password', authController.postNewPassword);

module.exports = router;
