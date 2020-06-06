const mongoose = require('mongoose');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const HttpError = require('../models/http-error');

const getCart = async (req,res,next) => {

};

const addtocart = async (req,res,next) => {
	
// 	var cart = new Cart(req.session.cart ? req.session.cart : {});

// 	let existing;

//   const pid = req.params.pid;

//   console.log(pid);
//   try {
//     existing = await Products.findById(pid);
//   } catch (err) {
//     return next(new HttpError('Cannot update this product as it does not exist', 422));
//   }
//   if (existing) {
//         cart.add(existing, existing.id);
//   		req.session.cart = cart;
// 	  	console.log(req.session.cart);
//     }
// res.json({
// 	message: "check console if cart is their or not"
// })

// var slug = req.params.product;
const id = req.params.id;

    Product.findOne({ _id : id}, function (err, p) {
        if (err)
            console.log(err);

        if (typeof req.session.cart == "undefined") {
            req.session.cart = [];
            req.session.cart.push({
                title: id,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                image: '/product_images/' + p._id + '/' + p.image
            });
        } else {
            var cart = req.session.cart;
            var newItem = true;

            for (var i = 0; i < cart.length; i++) {
                if (cart[i].title == id) {
                    cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                cart.push({
                    title: p.name,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                    image: '/product_images/' + p._id + '/' + p.image
                });
            }
        }

//        console.log(req.session.cart);
        req.flash('success', 'Product added!');
        res.redirect('back');
    });

};

const removefromcart = async (req,res,next) => {

};

const checkout = async (req,res,next) => {

  // will be reached only if data is verified by stripe
  // not yet written the stripe code for frontend


};

const reducebyone = async(req,res,next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    const pid = req.params.id;

    cart.rereducebyone(pid);
    req.session.cart = cart;

    // will add later
    // res.redirect('/')
}

const reduceitem = async(req,res,next) => {
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    const pid = req.params.id;

    cart.removeItem(pid);
    req.session.cart = cart;

    // will add later
    // res.redirect('/')
}

exports.getCart = getCart;
exports.addtocart = addtocart;
exports.removefromcart = removefromcart;
exports.checkout = checkout;