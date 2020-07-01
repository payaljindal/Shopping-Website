const mongoose = require('mongoose');
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
const HttpError = require('../models/http-error');

const addtocart = async (req,res,next) => {
    const id = req.params.id;

    Product.findOne({ _id : id}, function (err, p) {
        if (err)
            console.log(err);

        if (req.user.cart.length == 0) {
            req.user.cart.push({
                title: p.name,
                qty: 1,
                price: parseFloat(p.price).toFixed(2),
                id: id,
                image : p.image
            });
           
        } else {
            var newItem = true;
            
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
                    id: id,
                    image : p.image
                });
            }
            
        }
        req.user.save();
        req.flash('success', 'Product added to cart!');
        res.redirect('/products/details/'+ id);
    });

};



const checkout = (req,res,next) => {
    
    // console.log(req.user.cart);
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
    var cart = req.user.cart;
    var action = req.query.action;
    var qty;

    for (var i = 0; i < cart.length; i++) {
        if (req.user.cart[i].title == title) {
            switch (action) {
                case "add":
                    qty =  req.user.cart[i].qty ; 
                    price = parseFloat(req.user.cart[i].price).toFixed(2);
                    id = req.user.cart[i].id;
                    image = req.user.cart[i].image;
                    req.user.cart.push({
                        title: title,
                        qty: qty+1,
                        price: parseFloat(price).toFixed(2),
                        id:id,
                        image:image
                    });
                    cart.splice(i, 1);
                    break;
                case "remove":
                    qty =  req.user.cart[i].qty ; 
                    price = parseFloat(req.user.cart[i].price).toFixed(2);
                    id = req.user.cart[i].id;
                    image = req.user.cart[i].image;

                    if(qty!=1){
                    req.user.cart.push({
                        title: title,
                        qty: qty-1,
                        price: parseFloat(price).toFixed(2),
                        id :id,
                        image :image
                    });
                    }
                    cart.splice(i, 1);
                    break;
                case "clear":
                    req.user.cart.splice(i, 1);
                    if (req.user.cart.length == 0)
                        req.user.cart = [];
                    break;
                default:
                    console.log('update problem');
                    break;
            }
            break;
        }
    }
    req.user.save();
    req.flash('success', 'Cart updated!');
    res.render('checkout', {
        title: 'Checkout',
        cart: req.user.cart,
        message : req.flash('Cart updated!')
    });
}


const clear = (req,res,next) =>{
    
    req.user.cart = [];
    req.user.save();

    req.flash('danger', 'Cart cleared!');
    res.redirect('/cart/checkout');
}


exports.update = update;
exports.addtocart = addtocart;
exports.checkout = checkout;
exports.clear = clear;