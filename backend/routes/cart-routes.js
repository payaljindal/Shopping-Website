const express = require('express');
const router = express.Router();

const cartControllers = require('../controllers/cart-controllers');

// display cart
router.get('/',cartControllers.getCart);

// add to cart
router.patch('/addtocart', cartControllers.addtocart);

// remove from cart
router.patch('/removefromcart', cartControllers.removefromcart);

module.exports = router;