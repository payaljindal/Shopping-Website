var express = require('express');
var router = express.Router();
const Cart = require('../models/cart-model');
const Product = require('../models/product-model');
var Order = require('../models/order-model');

/* GET home page. */
router.get('/', function (req, res, next) {
    // var successMsg = req.flash('success')[0];
    Product.find(function (err, docs) {
        var productChunks = [];
        var chunkSize = 3;
        for (var i = 0; i < docs.length; i += chunkSize) {
            productChunks.push(docs.slice(i, i + chunkSize));
        }
        res.render('shop/index', {title: 'Shopping Cart', products: productChunks});
    });
});
