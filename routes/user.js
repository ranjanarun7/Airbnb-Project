const express = require('express');
const router = express.Router();
const passport = require('passport');
const { saveReturnTo } = require('../middleware');
const { renderSignupForm, signupUser, renderLoginForm, logoutUser, loginUser } = require('../controllers/users');

// Register new user
router.route('/signup')
.get(renderSignupForm)
.post(signupUser);

// Login user
router.route('/login')
.get(renderLoginForm)
.post(saveReturnTo, passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), loginUser);

// Logout user
router.get('/logout', logoutUser);
module.exports = router;  