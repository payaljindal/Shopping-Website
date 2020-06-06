const express = require('express');
const router = express.Router();

const cartControllers = require('../controllers/cart-controllers');

// display cart
router.get('/',cartControllers.getCart);

// add to cart
router.get('/add/:id', cartControllers.addtocart);

// remove from cart
router.patch('/removefromcart', cartControllers.removefromcart);

router.post('/checkout',cartControllers.checkout);
// checkout the list

module.exports = router;