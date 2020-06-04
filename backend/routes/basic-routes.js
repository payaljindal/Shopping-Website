var express = require('express');
var router = express.Router();


router.get('/about',function(req,res){

    res.render('aboutus',{title : 'About Us'});

});

router.get('/contact',function(req,res){

    res.render('contactus',{title : 'Contact Us'});

});

module.exports = router;