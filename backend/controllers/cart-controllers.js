const mongoose = require('mongoose');
const Cart = require('../models/cart-model');
const Products = require('../models/product-model');
const HttpError = require('../models/http-error');

const getCart = async (req,res,next) => {

};

const addtocart = async (req,res,next) => {
	
	var cart = new Cart(req.session.cart ? req.session.cart : {});

	let existing;

  const pid = req.params.pid;

  console.log(pid);
  try {
    existing = await Products.findById(pid);
  } catch (err) {
    return next(new HttpError('Cannot update this product as it does not exist', 422));
  }
  
  

  if (existing) {
        cart.add(existing, existing.id);
  		req.session.cart = cart;
	  	console.log(req.session.cart);
    }
  
  


res.json({
	message: "check console if cart is their or not"
})

};

const removefromcart = async (req,res,next) => {

};

exports.getCart = getCart;
exports.addtocart = addtocart;
exports.removefromcart = removefromcart;