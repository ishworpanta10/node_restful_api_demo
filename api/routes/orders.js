const { response } = require('express');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Order = require('../models/orders');

// handle incommming GET request to /orders
router.get('/', (req, res, next) => {
  Order.find()
    .select('orderName orderQuantity product')
    .exec()
    .then((orders) => {
      const response = {
        count: orders.length,
        orders: orders.map((order) => {
          return {
            orderName: order.orderName,
            orderQuantity: order.orderQuantity,
            product: order.productId,
            _id: order._id,
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

router.post('/', (req, res, next) => {
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
  const order = new Order({
    _id: mongoose.Types.ObjectId(),
    orderName: req.body.orderName,
    orderQuantity: req.body.orderQuantity,
    product: req.body.productId,
  });

  order
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  res.status(200).json({
    message: 'Order details',
    orderId: id,
  });
});

router.delete('/:orderId', (req, res, next) => {
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
            product: 'id',
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
