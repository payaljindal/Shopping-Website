const mongoose = require('mongoose');
const Product = require('../models/product-model');
const HttpError = require('../models/http-error');


const getProducts = async (req,res,next) => {
    // let products;
  // try{
  //   products = Products.find({});
  // }catch{
  //   return next(new HttpError('Could not get products list. Please try again later')
  //     );
  // }

  var count;

  await Product.countDocuments(function (err, c) {
      count = c;
  });

  Product.find(function (err, products) {
      res.render('index', {
        title: 'Shopping Cart',
          products: products,
          count: count
      });
  });

};



exports.getProducts = getProducts;