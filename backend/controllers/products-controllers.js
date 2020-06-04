const mongoose = require('mongoose');
const Products = require('../models/product-model');
const HttpError = require('../models/http-error');


const getProducts = async (req,res,next) => {
    let products;
  try{
    products = await Products.find({});
  }catch{
    return next(new HttpError('Could not get products list. Please try again later')
      );
  }

  res.status(200).json({ Products: products.map((products) => products.toObject({ getters: true })) });
  // res.render('shop/index', {title: 'Shopping Cart', products: products} );
};



exports.getProducts = getProducts;