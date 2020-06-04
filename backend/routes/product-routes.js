const express = require('express');
const router = express.Router();

const productControllers = require('../controllers/products-controllers');


// to display all products
router.get('/',productControllers.getProducts);

module.exports = router;
