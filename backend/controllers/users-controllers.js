const mongoose = require('mongoose');
const Users = require('../models/user-model');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Order = require('../models/order-model.js')
const Cart = require('../models/cart-model.js')

const getUsers = async (req,res,next) => {

	let users;
	try{
		users = await Users.find({}, '-Password');
	}catch{
		return next(new HttpError('Could not get users list. Please try again later')
			);
	}

	res.status(200).json({Users: users.map((users) => users.toObject({ getters: true })) });

}

const signup = async (req,res,next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422),
    );
  }

	const{ name, email , password } = req.body;
	
	
	let existinguser;

	try{
		existinguser = await Users.findOne({email : email });
	}catch {
		const error = new HttpError('Some error occured. Please try again later.')
	}

	if (existinguser) {
    const error = new HttpError(
      'User exists already, please login instead.',
      422,
    );
    return next(error);
    }

    let hashedPassword;
	  try {
	    hashedPassword = await bcrypt.hash(password, 12);
	  } catch (err) {
	    const error = new HttpError(
	      'Could not create user, please try again.',
	      500,
	    );
	    return next(error);
	  }

	  const createdUser = new Users({
	  	name,
	  	email,
	  	password : hashedPassword,
	  	cart : []
	  });

	  try {
      await createdUser.save();
      } catch (err) {
      const error = new HttpError(
      'Signing up failed, please try again later.',
      500,
      );
      return next(error);
      }


  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email
  });


};

const login = async (req,res,next) => {

	 const { email,password } = req.body;

  
  let existingUser;
  try {
    existingUser = await Users.findOne({ email:email });
  } catch (error) {
    return next(new HttpError('Something went wrong!Please Try Again', 500));
  }

  if (!existingUser) {
    return next(
      new HttpError(
        'Could not identify user, credentials seem to be wrong.',
        401,
      ),
    );
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    const error = new HttpError(
      'Invalid credentials passed. Please, try again',
      500,
    );
    return next(error);
  }

  if (!isValidPassword) {
    const error = new HttpError(
      'Invalid credentials, could not log you in.',
      401,
    );
    return next(error);
  }

  res.json({
  	message : "Successfully logged in!",
    userId: existingUser.id,
    email: existingUser.email,
    name: existingUser.name
  });

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
  res.redirect('/signup');

}


// to be added
const profile = (req,res,next) => {
    
    // Order.find({user : req.user}, function(err,orders){
    //   if(err){
    //     return res.write('Errorr');
    //   }
    //   var cart;
    //   orders.forEach(function(order){
    //     cart = new Cart(order.cart);
    //     order.items = cart.generatearray();
    //   });
    //   res.render('user/profile', {orders : orders});
    // });


    console.log("profie page");
    res.json({
      message : "profile page"
    })

}

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;
exports.changepassword = changepassword;
exports.logout = logout;
exports.profile = profile;