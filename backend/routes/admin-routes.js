var express = require('express');
var router = express.Router();
const mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
const Product = require('../models/product-model');
const fileupload = require('../middleware/file-upload')




// to display all products to admin
router.get('/',isAdmin, async function (req, res) {

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
        res.render('admin/products', {
            products: products,
            count: count
        });
    });
});

// get route to add product
router.get('/add-product',isAdmin, function (req, res) {

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

// post route to add products
// image is not uploaded
router.post('/add-product',isAdmin, async function (req, res) {


    // req.checkBody('name', 'Title must have a value.').notEmpty();
      const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
  
     const imageFile = req.files.image.name;
     console.log(imageFile);

    console.log("1");

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

                    if (imageFile != "") {
                        var productImage = req.files.image;
                        var path = 'public/product_images/' + created._id + '_' + imageFile;

                        productImage.mv(path, function (err) {
                            return console.log(err);
                        });
                    }

                    });
                    }
                     catch (err) {
                    req.flash('danger', 'some error occured!');
                    console.log("some error occured");
                    }

                    var count;

                    await Product.countDocuments(function (err, c) {
                        count = c;
                    });
                
                    Product.find(function (err, products) {
                        res.render('admin/products', {
                            products: products,
                            count: count
                        });
                    });
                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products',);

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


// get edit page 

router.get('/edit-product/:id',isAdmin, function (req, res) {

    var errors;

    if (req.session.errors)
        errors = req.session.errors;
    req.session.errors = null;


        Product.findById(req.params.id, function (err, p) {
            if (err) {
                console.log(err);
                res.redirect('/admin/products');
            } else {
                        res.render('admin/edit_product', {
                            name : p.name,
                            errors: errors,
                            flavour : p.flavour,
                            texture : p.texture,
                            suggesteduse : p.suggesteduse,
                            category: p.category,
                            price: parseFloat(p.price).toFixed(2),
                            image: p.image,
                            id: p._id
                        });
                    }    
            
        });
});

router.post('/edit-product/:id',isAdmin, async function (req, res) {

    // var imageFile = typeof req.files.image !== "undefined" ? req.files.image.name : "";

    // req.checkBody('name', 'Title must have a value.').notEmpty();
    // req.checkBody('taste', 'Description must have a value.').notEmpty();
    // req.checkBody('price', 'Price must have a value.').isDecimal();
    // req.checkBody('image', 'You must upload an image').isImage(imageFile);

    const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
    // const imageFile = req.files.image.name;
//   console.log(name);
    let existing;
  
    const id = req.params.id;
  
    // console.log(pid);
    
    
    await Product.findById(id, function (err, existing) {
                        if (err)
                            console.log(err);

                            
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
          // if(image != "")
          //     existing.image = imageFile;
    }
    try {
       existing.save();
    } catch (err) {
      console.log(err);
    }
                        });
    
  
    // const{ name, flavour, texture, taste, suggesteduse, price , category } = req.body;
    // var id = req.params.id;
    // const imageFile = req.files.image.name;
    // var errors = req.validationErrors();

    // if (errors) {
    //     req.session.errors = errors;
    //     res.redirect('/admin/products/edit-product/' + id);
    // } else {
    //     Product.findOne({ _id: {'$ne': id}}, function (err, p) {
    //         if (err)
    //             console.log(err);

    //         if (p) {
    //             req.flash('danger', 'Product title exists, choose another.');
    //             res.redirect('/admin/products/edit-product/' + id);
    //         } else {
    //             Product.findById(id, function (err, p) {
    //                 if (err)
    //                     console.log(err);

    //                 p.title = title;
    //                 p.slug = slug;
    //                 p.desc = desc;
    //                 p.price = parseFloat(price).toFixed(2);
    //                 p.category = category;
    //                 if (imageFile != "") {
    //                     p.image = imageFile;
    //                 }

    //                 p.save(function (err) {
    //                     if (err)
    //                         console.log(err);

    //                     if (imageFile != "") {
    //                         if (pimage != "") {
    //                             fs.remove('public/product_images/' + id + '/' + pimage, function (err) {
    //                                 if (err)
    //                                     console.log(err);
    //                             });
    //                         }

    //                         var productImage = req.files.image;
    //                         var path = 'public/product_images/' + id + '/' + imageFile;

    //                         productImage.mv(path, function (err) {
    //                             return console.log(err);
    //                         });

    //                     }

    //                     req.flash('success', 'Product edited!');
    //                     res.redirect('/admin/products/edit-product/' + id);
    //                 });

    //             });
    //         }
    //     });
    // }
    res.redirect('/admin/products');
});


// delete product 
router.get('/delete-product/:id',isAdmin, async function (req, res) {

    var id = req.params.id;

    var path = 'public/product_images/' + id;

    fs.remove(path, async function (err) {
        if (err) {
            console.log(err);
        } else {

            await Product.findById(id,   function (err, existing){
                existing.remove();
            });
            
            req.flash('success', 'Product deleted!');
            res.redirect('/admin/products');
        }
    });

});




module.exports = router;
