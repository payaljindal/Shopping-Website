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
	[
    check('name').not().isEmpty(),
    check('email').normalizeEmail().isEmail().not().isEmpty(),
    check('password').isLength({ min: 6 }),
  ],
  userControllers.signup);

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

router.get('/profile',isLoggedIn,userControllers.profile);


// add profile route


module.exports = router;

function isLoggedIn(req, res, next){

	// #problem because their is no frontend yet, till then use this.
	// if(req.isAuthenticated()){
	// 	return next();
	// }
	// res.redirect('/login');

	console.log("in logged in");
	return next();
}

