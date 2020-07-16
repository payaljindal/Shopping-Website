const mongoose = require('mongoose');
const Product = require('../models/product-model');
const HttpError = require('../models/http-error');


const getProducts = async (req,res,next) => {

  var count;
  var loggedIn = (req.isAuthenticated()) ? true : false;
  // console.log(loggedIn);
  await Product.countDocuments(function (err, c) {
      count = c;
  });

  Product.find(function (err, products) {
      res.render('index', {
        title: 'All Products',
          products: products,
          count: count,
          loggedIn: loggedIn,
      });
  });

};


const details = async (req,res,next) => {

  const id = req.params.id;

  var loggedIn = (req.isAuthenticated()) ? true : false;
  var errors;

  if (req.session.errors)
      errors = req.session.errors;
  req.session.errors = null;


      Product.findById(id, function (err, p) {
          if (err) {
              console.log(err);
              res.redirect('/');
          } else {
                      res.render('details', {
                        title: 'Samy Greens',
                          name : p.name,
                          errors: errors,
                          flavour : p.flavour,
                          texture : p.texture,
                          suggesteduse : p.suggesteduse,
                          category: p.category,
                          price: parseFloat(p.price).toFixed(2),
                          image: p.image,
                          id: p._id,
                          loggedIn: loggedIn,
                          available : p.available
                      });
                  }    
          
      });
};




const getProductsByCategory = async (req,res,next) => {
 
    const {category} = req.body ;
    var loggedIn = (req.isAuthenticated()) ? true : false;

  var count;
  let user = req.user;

  await Product.countDocuments(function (err, c) {
      count = c;
  });

  Product.find({category : category}, function (err, products) {
      res.render('product_category', {
        title: 'Category',
        category : category,
          products: products,
          count: count,
          loggedIn: loggedIn,
          user:user,
      });
  });
};



exports.getProducts = getProducts;
exports.details = details;
exports.getProductsByCategory = getProductsByCategory;