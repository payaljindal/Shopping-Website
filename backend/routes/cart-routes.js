const express = require('express');
const router = express.Router();

const cartControllers = require('../controllers/cart-controllers');

// add to cart
router.get('/add/:id', cartControllers.addtocart);

// remove from cart
router.get('/update/:title', cartControllers.update);

// checkout the list
router.get('/checkout',cartControllers.checkout);

router.get('/clear', cartControllers.clear);

// get buy form 
router.get('/buy', function (req, res) {

    var cart = req.user.cart;
    var total = 0; 
    cart.forEach(function(product){ 
        var sub = parseFloat(product.qty * product.price).toFixed(2) 
        total += +sub 
    });
    console.log(req.user.cart);
   if(req.user.cart === []){
       console.log("in if");
       req.flash('danger', 'First, add something to cart!');
       res.redirect('/products/all');
   }
   else{
       console.log("else");
   var name = req.user.name;
       res.render('buynow', {
           name : name,
           title : 'Buy Now',
           total : total
       });
   }
   


});

module.exports = router;