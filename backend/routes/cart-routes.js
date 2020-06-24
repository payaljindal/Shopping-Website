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

    var name = req.user.name;
    var contact = "";
    var address = "";

    
        res.render('buynow', {
            name : name,
            contact : contact,
            address : address,
            title : 'Buy Now'
        });
   


});

module.exports = router;