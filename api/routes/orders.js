const express = require('express');

const router = express.Router();

// handle incommming GET request to /orders
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Order were fetched',
  });
});

router.post('/', (req, res, next) => {
  // creating order
  const order = {
    orderId: req.body.orderId,
    orderName: req.body.orderName,
    orderQuantity: req.body.orderQuantity,
  };
  res.status(201).json({
    message: 'Order was created',
    cratedOrder: order,
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
  res.status(200).json({
    message: `Order deleted ${id}`,
  });
});

module.exports = router;
