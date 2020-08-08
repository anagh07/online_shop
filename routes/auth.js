const express = require('express');

const router = express.Router();

const authController = require('../controllers/auth');

// @METHOD  GET
// @ROUTE   /login
router.get('/login', authController.getLogin);

// @METHOD  POST
// @ROUTE   /login
router.post('/login', authController.postLogin);

// @METHOD  POST
// @ROUTE   /logout
router.post('/logout', authController.postLogout);

// @METHOD  GET
// @ROUTE   /signup
router.get('/signup', authController.getSignup);

// @METHOD  POST
// @ROUTE   /signup
router.post('/signup', authController.postSignup);

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
