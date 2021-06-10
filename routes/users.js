const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const users = require('../controllers/users');


router.route('/register')
//Get registration form
    .get(users.renderRegisterForm)
//register new user
    .post(catchAsync(users.registerUser));
router.route('/login')
//render login form
    .get(users.renderLoginForm)
//login
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), users.login);
//logout
router.get('/logout', users.logout);

module.exports = router;