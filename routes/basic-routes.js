var express = require('express');
var router = express.Router();

const keys = require('../config/keys');
const stripe = require('stripe')(keys.stripeSecretKey);
router.get('/',function(req,res){
    res.render('home',{title : 'Home'});
});

router.get('/about',function(req,res){
  res.render('aboutus',{title : 'About Us'});
});

router.get('/contact',function(req,res){
    res.render('contactus',{title : 'Contact Us'});
});

// Charge Route
router.post('/charge', (req, res) => {
  // console.log(req.user.cart);
  var cart = req.user.cart;
     var total = 0; 
     cart.forEach(function(product){ 
         var sub = parseFloat(product.qty * product.price).toFixed(2) 
         total += +sub 
     });

    const amount = total*100;
    stripe.customers.create({
      email: req.body.stripeEmail,
      source: req.body.stripeToken
    })
    .then(customer => stripe.charges.create({
      amount,
      description: 'Web Development Ebook',
      currency: 'inr',
      customer: customer.id
    }))
    .then(charge => res.render('success',{
      title : "Buy Form"
    }));
  });

module.exports = router;


