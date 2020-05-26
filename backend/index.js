const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');


const session = require('express-session');
const mongostore = require('connect-mongo')(session);

const usersRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');

app.use(session({
  secret : 'mysupersecret',
  resave : false,
  saveUninitialized : false,
  store : new mongostore({ mongooseConnection : mongoose.connection }),
  cookie : { maxAge : 180 * 60 * 1000 }
}));

app.use(bodyParser.json());

 // user routes 
app.use('/api/users', usersRoutes);

// product routes 
app.use('/api/products' , productRoutes);

// cart routes
app.use('/api/cart', cartRoutes);


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