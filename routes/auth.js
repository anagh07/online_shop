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

module.exports = router;
