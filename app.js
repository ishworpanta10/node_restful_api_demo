const express = require('express');
const app = express();
const morgan = require('morgan');

const productRoute = require('./api/routes/products');
const orderRoute = require('./api/routes/orders');

app.use(morgan('dev'));

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
