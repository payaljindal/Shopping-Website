const mongoose = require('mongoose');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const HttpError = require('../models/http-error');

const addtocart = async (req,res,next) => {
	console.log(req.user);
    const id = req.params.id;

    Product.findOne({ _id : id}, function (err, p) {
        if (err)
            console.log(err);

        if (req.user.cart.length == 0) {
            console.log("if");
            console.log(req.user.cart);
            // req.session.cart = [];
            // req.session.cart.push({
            //     title: p.name,
            //     qty: 1,
            //     price: parseFloat(p.price).toFixed(2)
            // });
            console.log("fdxz");
            req.user.cart.push({
                title: p.name,
                qty: 1,
                price: parseFloat(p.price).toFixed(2)
            });
           
        } else {
            console.log("else");
            console.log(req.user.cart);
            var newItem = true;
            
            // updates in this are not saved in database
            for (var i = 0; i < req.user.cart.length; i++) {
                if (req.user.cart[i].title == p.name) {
                    req.user.cart[i].qty++;
                    newItem = false;
                    break;
                }
            }

            if (newItem) {
                req.user.cart.push({
                    title: p.name,
                    qty: 1,
                    price: parseFloat(p.price).toFixed(2),
                });
            }
            
        }
        req.user.save();
        console.log(req.user.cart);
        req.flash('success', 'Product added!');
        console.log(req.user);
        res.redirect('back');
    });

};



const checkout = (req,res,next) => {
    
    console.log(req.user.cart);
    if (req.session.cart && req.session.cart.length == 0) {
        delete req.session.cart;
        res.redirect('/cart/checkout');
    } else {
        
        res.render('checkout', {
            title: 'Checkout',
            cart: req.user.cart
        });
    }
};

const update = async(req,res,next) => {
    var title = req.params.title;
    var cart = req.session.cart;
    var action = req.query.action;

    for (var i = 0; i < cart.length; i++) {
        if (cart[i].title == title) {
            switch (action) {
                case "add":
                    cart[i].qty++;
                    break;
                case "remove":
                    cart[i].qty--;
                    if (cart[i].qty < 1)
                        cart.splice(i, 1);
                    break;
                case "clear":
                    cart.splice(i, 1);
                    if (cart.length == 0)
                        delete req.session.cart;
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }

    req.flash('success', 'Cart updated!');
    res.redirect('/cart/checkout');
}


const clear = (req,res,next) =>{
    
    delete req.user.cart;
    req.flash('success', 'Cart cleared!');
    res.redirect('/cart/checkout');
}


exports.update = update;
exports.addtocart = addtocart;
exports.checkout = checkout;
exports.clear = clear;