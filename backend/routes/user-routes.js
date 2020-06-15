const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/users-controllers');
const { check } = require('express-validator');
const passport = require('passport');
var bcrypt = require('bcryptjs');


// Get Users model
var User = require('../models/user-model');

// get register
router.get('/register', function (req, res) {

    res.render('register', {
        title: 'Register',
    });

});


// route to display all users for admin only
router.get('/',userControllers.getUsers);

// route to signup
router.post('/register',
  userControllers.signup);

// get route for login 
router.get('/login', function (req, res) {

    if (res.locals.user) res.redirect('/');
    
    res.render('login', {
        title: 'Log in'
    });

});

// route to login
router.post('/login',userControllers.login);

// route to change password
router.patch('/changepassword/:uid',
	[
	check('prevPassword').not().isEmpty(), 
	check('newPassword').isLength({ min: 6 }).not().isEmpty()
	],
	userControllers.changepassword);


// route to logout
router.get('/logout', userControllers.logout);

// profile page

router.get('/profile',userControllers.profile);


// add profile route


module.exports = router;

