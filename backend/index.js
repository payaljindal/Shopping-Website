const express = require('express');

const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HttpError = require('./models/http-error');

const usersRoutes = require('./routes/user-routes');
const productRoutes = require('./routes/product-routes');
const cartRoutes = require('./routes/cart-routes');


mongoose
  .connect(
    'mongodb+srv://Payal:Shipshop@cluster0-sw3qo.mongodb.net/test?retryWrites=true&w=majority',
    { useCreateIndex: true,useUnifiedTopology: true, useNewUrlParser: true },
  )
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));