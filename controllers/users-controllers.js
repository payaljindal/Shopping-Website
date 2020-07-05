const express = require('express');
const mongoose = require('mongoose');
const User = require('../models/user-model');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Order = require('../models/order-model.js')
const Cart = require('../models/cart-model.js')
const passport = require('passport');
const { checkBody } = require('express-validator');
const { use } = require('passport');

const getUsers = async (req,res,next) => {

	let users;
	try{
		users = await User.find({}, '-Password');
	}catch{
		return next(new HttpError('Could not get users list. Please try again later')
			);
	}

	res.status(200).json({Users: users.map((users) => users.toObject({ getters: true })) });

}

const signup = async (req,res,next) => {

  var name = req.body.name;
  var email = req.body.email;
  var username = req.body.username;
  var password = req.body.password;
  var password2 = req.body.password2;
  
  if (name=="" || email=="" || username=="" || password =="" || password2=="") {

    req.flash('danger', 'All the fields are required');
      res.render('register', {
          user: null,
          title: 'Register'
      });
  }else if(password2 !== password){
    req.flash('danger', 'Passwords did not match');
    res.render('register', {
        user: null,
        title: 'Register'
    });
  }
   else {
      User.findOne({username: username}, function (err, user) {
          if (err)
              console.log(err);

          if (user) {
              req.flash('danger', 'Username exists, choose another!');
              res.redirect('/users/register');
          } else {
              var user = new User({
                  name: name,
                  email: email,
                  username: username,
                  password: password,
                  admin: 0,
                  cart : []
              });

              bcrypt.genSalt(10, function (err, salt) {
                  bcrypt.hash(user.password, salt, function (err, hash) {
                      if (err)
                          console.log(err);

                      user.password = hash;

                      user.save(function (err) {
                          if (err) {
                              console.log(err);
                          } else {
                              req.flash('success', 'You are now registered!');
                              console.log("succes");
                              res.redirect('/users/login');
                          }
                      });
                  });
              });
          }
      });
  }
};

const login = async (req,res,next) => {

  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true,
    user : req.user 
  })(req, res, next);

}



const changepassword = async (req,res,next) => {

 const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

  const { prevPassword, newPassword } = req.body;
  const userid = req.params.uid;
  
  let id;
  try {
    id = await Users.findById(userid);
  } catch (err) {
    return next(new HttpError('Could Not find user.Please Try Again', 422));
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(prevPassword, id.password);
  } catch (err) {
    const error = new HttpError(
      'Could not change password, try again later.',
      500,
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not update password.',
      401,
    );
    return next(error);
  }

  let newhashPassword;
  try {
    newhashPassword = await bcrypt.hash(newPassword, 12);
  } catch (err) {
    const error = new HttpError(
      'Could not create user, please try again.',
      500,
    );
    return next(error);
  }
  id.password = newhashPassword;
  try {
    await id.save();
  } catch (err) {
    return next(
      new HttpError('Could Not Update Password. Please Try Again.', 422),
    );
  }

  res.json({
    message: 'Password updated',
  });

}

const logout = (req,res,next) => {
  req.logout();
  req.flash('success','Logged out!');
  // console.log('logout');
  res.redirect('/users/login');

}


// user profile page
const profile = (req,res,next) => {
    var user = req.user;

    Order.find({user : req.user}, function(err,orders){
      if(err){
        return res.write('Errorr');
      }

      res.render('profile',{
      title: "Profile",
      user: user,
      orders  : orders
      });
     
    });
}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.changepassword = changepassword;
exports.logout = logout;
exports.profile = profile;