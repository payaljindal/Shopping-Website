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


const updateProduct = async (req,res,next) => {
   const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
  
  
  let existing;

  const pid = req.params.pid;

  // console.log(pid);
  try {
    existing = await Products.findById(pid);
  } catch (err) {
    return next(new HttpError('Cannot update this product as it does not exist', 422));
  }
  
  if (!existing) {
    const error = new HttpError(
      'Cannot update this product as it does not exist',
      422,
    );
    return next(error);
    }

  if (existing) {
        if(name != "")
          existing.name = name;
        if(flavour != "")
          existing.flavour = flavour;
        if(texture != "")
          existing.texture = texture;
        if(taste != "")
          existing.taste = taste;
        if(suggesteduse != "")
          existing.suggesteduse = suggesteduse;
        if(price != "")
          existing.price = price;
        if(category != "")
          existing.category = category;
    }

    try {
    await existing.save();
  } catch (err) {
    return next(
      new HttpError('Could Not Update Product. Please Try Again.', 422),
    );
  }

  res.status(201).json({
    message : "Successfully updated data",
    userId: existing.id
  });
};



// delete product option to be added

exports.getProducts = getProducts;
// exports.createProduct = createProduct;
exports.updateProduct = updateProduct;