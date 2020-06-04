var express = require('express');
var router = express.Router();
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
// var auth = require('../config/auth');
// var isAdmin = auth.isAdmin;
const Product = require('../models/product-model');





// to display all products to admin
router.get('/', function (req, res) {

  // let products;
  // try{
  //   products = Products.find({});
  // }catch{
  //   return next(new HttpError('Could not get products list. Please try again later')
  //     );
  // }

    var count;

    Product.countDocuments(function (err, c) {
        count = c;
    });

    Product.find(function (err, products) {
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});


router.get('/add-product', function (req, res) {

    var name = "";
    var texture = "";
    var price = "";
    var flavour = "";
    var category = "";
    var suggesteduse = "";

    
        res.render('admin/add_product', {
            name : name,
            texture : texture,
            price : price ,
            flavour : flavour ,
            category : category,
            suggesteduse : suggesteduse
        });
   


});

router.post('/add-product', async function (req, res) {

      const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
  
     const imageFile = req.files.image.name;
  let existing;


    existing = await Product.findOne({ name : name });
 

  if (existing) {
   req.flash('danger', 'Product title exists, choose another.');
    }

    
    const created = new Product({
      image : imageFile,
      name,
      flavour,
      texture,
      taste,
      suggesteduse,
      price,
      category
    });

    try {
      await created.save(function (err) {
                    if (err)
                        return console.log(err);

                    mkdirp('public/product_images/' + created._id, function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + created._id + '/gallery', function (err) {
                        return console.log(err);
                    });

                    mkdirp('public/product_images/' + created._id + '/gallery/thumbs', function (err) {
                        return console.log(err);
                    });

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + created._id + '/' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products');
                });
      } catch (err) {
      req.flash('danger', 'some error occured!');
      }


  req.flash('success', 'Product added!');
                    res.redirect('/admin/products');

});



// router.post('/create',)


// const createProduct = async (req,res,next) => {
//   const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
  
  
//   let existing;

//   try{
//     existing = await Products.findOne({ name : name });
//   }catch {
//     const error = new HttpError('Some server error occured. Please try again later.')
//   }

//   if (existing) {
//     const error = new HttpError(
//       'Product with this name exists already.',
//       422,
//     );
//     return next(error);
//     }

    
//     const created = new Products({
//       imagepath : 'https://pmcdeadline2.files.wordpress.com/2014/02/minecraft__140227211000.jpg',
//       name,
//       flavour,
//       texture,
//       taste,
//       suggesteduse,
//       price,
//       category
//     });

//     try {
//       await created.save();
//       } catch (err) {
//       const error = new HttpError(
//       'Creation failed, please try again later.',
//       500,
//       );
//       return next(error);
//       }


//   res.status(201).json({
//     message : "Successfully created new product",
//     userId: created.id,
    
//   });
  
// };







module.exports = router;
