const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

mongoose.connect(
  'mongodb+srv://ishworpanta10:' +
    process.env.MONGO_ATLAS_PW +
    '@cluster0.dezze.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

mongoose.Promise = global.Promise;

app.use(morgan('dev'));

app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);

// app.use(bodyParser.urlencoded({ extended = false }))
// app.use(bodyParser.json());

// CORS  enable to request for all client
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// Routes which should handle request
app.use('/products', productRoute);
app.use('/orders', orderRoute);

// handling errors for not found resoutrce requested
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

// handling errors thrown from anywhere in application . for eg. databases errors
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
