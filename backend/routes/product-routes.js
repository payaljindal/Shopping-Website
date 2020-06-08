const express = require('express');
const router = express.Router();
var auth = require('../config/auth');
var isUser = auth.isUser;

const productControllers = require('../controllers/products-controllers');


// to display all products
router.get('/all',productControllers.getProducts);

router.get('/details/:id',productControllers.details);

router.post('/category',productControllers.getProductsByCategory);

module.exports = router;
