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

  // res.status(200).json({ Products: products.map((products) => products.toObject({ getters: true })) });
  res.render('shop/index', {title: 'Shopping Cart', products: products} );
};

// const getProducts = async (req,res,next) => {

//   // re s.json({ "meass" : "pahunch gya"})
//     // Products.find(function (err, docs) {
//     //     var productChunks = [];
//     //     var chunkSize = 3;
//     //     for (var i = 0; i < docs.length; i += chunkSize) {
//     //         productChunks.push(docs.slice(i, i + chunkSize));

//         let products;
//   try{
//     products = await Products.find({});
//   }catch{
//     return next(new HttpError('Could not get products list. Please try again later')
//       );
//     //     }
//         res.render('shop/index', {title: 'Shopping Cart', products: products});
//     // });
//     // res.render('shop/index', { title: 'Express' });
// };




const createProduct = async (req,res,next) => {
  const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
  
  
  let existing;

  try{
    existing = await Products.findOne({ name : name });
  }catch {
    const error = new HttpError('Some server error occured. Please try again later.')
  }

  if (existing) {
    const error = new HttpError(
      'Product with this name exists already.',
      422,
    );
    return next(error);
    }

    
    const created = new Products({
      imagepath : 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
      name,
      flavour,
      texture,
      taste,
      suggesteduse,
      price,
      category
    });

    try {
      await created.save();
      } catch (err) {
      const error = new HttpError(
      'Creation failed, please try again later.',
      500,
      );
      return next(error);
      }


  res.status(201).json({
    message : "Successfully created new product",
    userId: created.id,
    
  });
  
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
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;