const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');

var expressValidator = require('express-validator');

const HttpError = require('./models/http-error');

const expresValidator = require('express-validator');
const fileUpload = require('express-fileupload');

const session = require('express-session');
const mongostore = require('connect-mongo')(session);

const usersRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');
const adminRoutes = require('./routes/admin-routes');
const basicRoutes = require('./routes/basic-routes')

// session middle ware
app.use(session({
  secret : 'mysupersecret',
  resave : false,
  saveUninitialized : false,
  store : new mongostore({ mongooseConnection : mongoose.connection }),
  cookie : { maxAge : 180 * 60 * 1000 }
}));


// view engine setup
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));


// expess file upload middle ware
app.use(fileUpload());

// body parser middle ware
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


// Express Messages middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});



// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req,res,next) {
  res.locals.cart = req.session.cart;
  res.locals.user = req.user || null;
  next();
});


// basic routes 
app.use('/' , basicRoutes);

//admin routes
app.use('/admin/products',adminRoutes);

 // user routes 
app.use('/users', usersRoutes);

// product routes 
app.use('/products' , productRoutes);

// cart routes
app.use('/cart', cartRoutes);




app.use((req,res,next) => {
	const error = new HttpError('Could not find this route.');
	throw error;
});


app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  const status = error.status || 500;
  res.status(status);
  res.json({ message: error.message || 'An unknown error occurred!' });
});




mongoose
  .connect(
    'mongodb+srv://Payal:Shipshop@cluster0-sw3qo.mongodb.net/test?retryWrites=true&w=majority',
    { useCreateIndex: true,useUnifiedTopology: true, useNewUrlParser: true },
  )
  .then(() => app.listen(process.env.PORT || 5000, console.log("Your server is up man.....")))
  .catch((err) => console.log(err));