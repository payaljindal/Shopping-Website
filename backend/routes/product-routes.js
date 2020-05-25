const express = require('express');
const router = express.Router();

const productControllers = require('../controllers/products-controllers');


// to display all products
router.get('/',productControllers.getProducts);

// to add a new products by admin
router.post('/create',productControllers.createProduct);

// to add data of a product by admin
router.patch('/update/:pid',productControllers.updateProduct);

module.exports = router;
