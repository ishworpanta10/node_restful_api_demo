const express = require('express');

const router = express.Router();

const checkAuth = require('..//middleware/check_auth');

// filtering the orders for those product that only exists

const OrdersController = require('../controller/orders');

// handle incommming GET request to /orders
router.get('/', checkAuth, OrdersController.orders_get_all);

router.post('/', checkAuth, OrdersController.orders_post);

router.get('/:orderId', checkAuth, OrdersController.order_get);

router.delete('/:orderId', checkAuth, OrdersController.orders_delete);

module.exports = router;
