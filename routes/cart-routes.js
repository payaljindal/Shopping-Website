const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isUser = auth.isUser;
const cartControllers = require('../controllers/cart-controllers');
const Order= require('../models/order-model');
// add to cart
router.get('/add/:id',isUser , cartControllers.addtocart);

// remove from cart
router.get('/update/:title',isUser , cartControllers.update);

// checkout the list
router.get('/checkout',isUser ,cartControllers.checkout);

router.get('/clear',isUser , cartControllers.clear);

// get buy form 
router.get('/buy',isUser , function (req, res) {

    var cart = req.user.cart;
     var total = 0; 
     cart.forEach(function(product){ 
         var sub = parseFloat(product.qty * product.price).toFixed(2) 
         total += +sub 
     });
     
    if(req.user.cart === []){
        req.flash('danger', 'First, add something to cart!');
        res.redirect('/products/all');
    }
    else{
    var name = req.user.name;
        res.render('buynow', {
            name : name,
            title : 'Buy Now',
            total : total
        });
    }
});

router.post('/buy',isUser , function (req, res) {

    var cart = req.user.cart;
    const { name, address ,contact } = req.body;
    const order = new Order({
        name,
        address,
        cart : req.user.cart,
        user : req.user,
        paymentid : "payment id",
        contact : contact,
        delivered : false
    });
    
    order.save();
    
    req.flash('success', 'Successfully ordered! We will deliver the order to you soon!');
    res.redirect('/cart/checkout');
});

module.exports = router;