const express = require('express');
const path = require('path');
// const expressHbs = require('express-handlebars');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

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
  resave : true,
  saveUninitialized : true,
  store : new mongostore({ mongooseConnection : mongoose.connection }),
  // cookie : { maxAge : 180 * 60 * 1000 }
}));

// view engine setup
// app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
// app.set('view engine', '.hbs');
app.set('views', path.join(__dirname,'views'));
app.set('view engine','ejs');

app.use(express.static(path.join(__dirname,'public')));


// expess file upload middle ware
app.use(fileUpload());

// body parser middle ware
app.use(bodyParser.urlencoded({ extended : false }));
app.use(bodyParser.json());


// express messages
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
})

app.get('*', function(req,res,next) {
  res.locals.cart = req.session.cart;
  next();
});


// basic routes 
app.use('/' , basicRoutes);

//admin routes
app.use('/admin/products',adminRoutes);

 // user routes 
app.use('/api/users', usersRoutes);

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
  res.status(error.code || 500);
  res.json({ message: error.message || 'An unknown error occurred!' });
});


mongoose
  .connect(
    'mongodb+srv://Payal:Shipshop@cluster0-sw3qo.mongodb.net/test?retryWrites=true&w=majority',
    { useCreateIndex: true,useUnifiedTopology: true, useNewUrlParser: true },
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));