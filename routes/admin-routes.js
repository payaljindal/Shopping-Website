var express = require('express');
var router = express.Router();
const mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImg = require('resize-img');
var auth = require('../config/auth');
var isAdmin = auth.isAdmin;
const Product = require('../models/product-model');
const Order = require('../models/order-model');
const fileupload = require('../middleware/file-upload')
const User = require('../models/user-model');


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
router.post('/add-product',isAdmin, async function (req, res) {

    var error =0;
    
      const{ name, flavour, texture, taste, suggesteduse, price , category,image,available } = req.body;

      if(name=="" || flavour=="" || texture=="" || taste =="" || suggesteduse=="" || price=="" || category=="" || image==""){
        req.flash('danger','Missing credentials');
        res.redirect('/admin/products/add-product');
        error =1;
      }

if(error === 0){
     let existing;
    existing = await Product.findOne({ name : name });

  if (existing) { 

    req.flash('danger', 'Product title exists, choose another.');
    res.redirect('/admin/products/add-product');
    }
    else{
    const imageFile = req.files.image.name;   
    const created = new Product({
      image : imageFile,
      name,
      flavour,
      texture,
      taste,
      suggesteduse,
      price,
      category,
      available,
    });
   
    try {
      await created.save(function (err) {
                        if (err){
                            req.flash('danger',err);
                            console.log("error1");
                            
                        }
                            
                        if (imageFile != "") {
                            var productImage = req.files.image;
                            var path = 'public/product_images/' + created._id + '_' + imageFile;

                            productImage.mv(path, function (err) {
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
                    });
                    req.flash('success', 'Product added!');
                    res.redirect('/admin/products');
                }
            }
});


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
                            id: p._id,
                            available : p.available
                        });
                    }    
            
        });
});

router.post('/edit-product/:id',isAdmin, async function (req, res) {
    const{ name, flavour, texture, taste, suggesteduse, price , category , image, available} = req.body;
    let existing;
    const id = req.params.id;

    await Product.findById(id, function (err, existing) {
        if (err)
            console.log(err);
                        
        if (existing) {
            existing.available = available;
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
            if(typeof req.body.uimage != "undefined"){
                var path = 'public/product_images/' + id + '_' + existing.image ;
                fs.remove(path, async function (err) {
                    if (err) {
                        console.log(err);
                    } 
                });
                const imageFile = req.files.uimage.name;
                var productImage = req.files.uimage;
                var path = 'public/product_images/' + id + '_' + imageFile;

                productImage.mv(path, function (err) {
                    });
                    existing.image = imageFile;

            }
                
        }
    try {
       existing.save();
    } catch (err) {
      console.log(err);
    }
    });
    
    req.flash('success','Product edited successfully');
    res.redirect('/admin/products');
});


// delete product 
router.get('/delete-product/:id',isAdmin, async function (req, res) {

    var id = req.params.id;

            await Product.findById(id,   function (err, existing){
                var path = 'public/product_images/' + id + '_' + existing.image ;
                    fs.remove(path, async function (err) {
                        if (err) {
                            console.log(err);
                        } else {
                            let users;
                        try{
                            users = await User.find({}, '-Password');
                        }catch(err){
                            console.log(err);
                        }
                            for(var i = 0; i < users.length; i++){
                                cart = users[i].cart;
                                
                                for(var j = 0; j < cart.length; j++){
                                    if(cart[j].title === existing.name){
                                        cart.splice(j, 1);
                                        users[i].save();
                                    }
                                }
                            }
                            existing.remove();
                        }
            });
            
            req.flash('success', 'Product deleted successfully!');
            res.redirect('/admin/products');
    });

});


// to display all orders to admin
router.get('/orders',isAdmin, async function (req, res) {  
      var count;
  
      await Order.countDocuments(function (err, c) {
          count = c;
      });
  
      Order.find(function (err, orders) {
          res.render('admin/orders', {
              orders : orders,
              count: count
          });
          
      });
    
  });

// to display all pending orders to admin
router.get('/orders/pending',isAdmin, async function (req, res) {  
    var count;

    await Order.countDocuments(function (err, c) {
        count = c;
    });

    Order.find(function (err, orders) {
        res.render('admin/pending_orders', {
            orders : orders,
            count: count
        });
        
    });
  
});

// update status from pending to done
router.get('/order/:id',isAdmin, async function (req, res) {
    const id = req.params.id;
    await Order.findById(id, function (err, existing) {
        if (err)
            console.log(err);
                        
       existing.delivered = true;
    try {
       existing.save();
    } catch (err) {
      console.log(err);
    }
    });
    req.flash('success','Order list updated successfully!');
    res.redirect('/admin/products/orders/pending');
});


module.exports = router;
