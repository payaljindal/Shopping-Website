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

module.exports = router;