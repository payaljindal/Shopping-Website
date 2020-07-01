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
    const amount = 2500;
    
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
    .then(charge => res.render('success'));
  });

module.exports = router;


