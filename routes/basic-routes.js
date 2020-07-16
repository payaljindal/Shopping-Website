var express = require('express');
const Product = require('../models/product-model');
var router = express.Router();

router.get('/',function(req,res){
  Product.find(function (err, products) {
    res.render('home',{
      title : 'Samy Greens',
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

router.get('/herbs',function(req,res){
  res.render('herbs',{
    title : 'About Herbs',
  });
});

router.get('/rockets',function(req,res){
  res.render('rockets',{
    title : 'About Rockets',
  });
});

router.get('/flowers',function(req,res){
  res.render('flowers',{
    title : 'About Flowers',
  });
});

router.get('/basils',function(req,res){
  res.render('basils',{
    title : 'About Basils',
  });
});
module.exports = router;


