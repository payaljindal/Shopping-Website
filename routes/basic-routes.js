var express = require('express');
const Product = require('../models/product-model');
var router = express.Router();

router.get('/',function(req,res){
  Product.find(function (err, products) {
    res.render('home',{
      title : 'Home',
    products : products
  });
});
    
});

router.get('/about',function(req,res){
  res.render('aboutus',{title : 'About Us'});
});

router.get('/contact',function(req,res){
    res.render('contactus',{title : 'Contact Us'});
});

module.exports = router;


