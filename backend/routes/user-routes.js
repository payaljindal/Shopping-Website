const express = require('express');
const userControllers = require('../controllers/users-controllers');

const router = express.Router();

// route to display all users for admin only
router.get('/',userControllers.getUsers);

// route to signup
router.post('/signup',userControllers.signup);

// route to login
router.post('/login',userControllers.login);

// route to change password
router.patch('/changepassword/:uid',userControllers.changepassword);


module.exports = router;

