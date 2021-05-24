const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/orders');

const checkAuth = require('..//middleware/check_auth');

// filtering the orders for those product that only exists

const Product = require('../models/products');

// handle incommming GET request to /orders
router.get('/', checkAuth, (req, res, next) => {
  Order.find()
    .select('_id orderName orderQuantity product')
    // getting the product info through populate method
    // 'product' we get from order schema model key
    //and ssecond arg is used for filtering product model
    .populate('product', 'productName')
    .exec()
    .then((orders) => {
      const response = {
        count: orders.length,
        orders: orders.map((order) => {
          return {
            _id: order._id,
            orderName: order.orderName,
            orderQuantity: order.orderQuantity,
            product: order.product,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/orders/' + order._id,
            },
          };
        }),
      };
      res.status(200).json(response);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: 'Order were fetched',
  // });
});

router.post('/', checkAuth, (req, res, next) => {
  // creating order
  // const order = {
  //   orderId: req.body.orderId,
  //   orderName: req.body.orderName,
  //   orderQuantity: req.body.orderQuantity,
  // };
  // res.status(201).json({
  //   message: 'Order was created',
  //   cratedOrder: order,
  // });

  // creating and storing    order in mongo db

  // filtering the orders for those product that only exists

  Product.findById(req.body.productId)
    .then((product) => {
      // checking only the available valid product id
      if (!product) {
        return res.status(404).json({
          error: 'Product not found',
        });
      }
      // if null it does not run this code already returned
      const order = new Order({
        _id: mongoose.Types.ObjectId(),
        orderName: req.body.orderName,
        orderQuantity: req.body.orderQuantity,
        product: req.body.productId,
      });

      return order.save();
    })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Order Created',
        createdOrder: {
          _id: result._id,
          product: result.product,
          orderName: result.orderName,
          orderQuantity: result.orderQuantity,
        },
        request: {
          type: 'GET',
          url: 'http://localhost:3000/orders/' + result._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.findById(id)
    .select('orderName orderQuantity product')
    .populate('product')
    .then((order) => {
      console.log('From Database', order);
      if (order) {
        res.status(200).json({
          order: order,
          request: {
            type: 'GET',
            description: 'Get All Orders',
            url: 'http://localhost:3000/orders',
          },
        });
      } else {
        res.status(404).json({
          message: 'No valid order for provided id',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: 'Order details',
  //   orderId: id,
  // });
});

router.delete('/:orderId', checkAuth, (req, res, next) => {
  const id = req.params.orderId;
  Order.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Order Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/orders',
          body: {
            orderName: 'String',
            orderQuantity: 'Number',
            productId: 'Id',
          },
        },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: `Order deleted ${id}`,
  // });
});

module.exports = router;
