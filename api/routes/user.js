const express = require('express');

const router = express.Router();

const UserController = require('..//controller/user');

const checkAuth = require('..//middleware/check_auth');

// getting all users info
router.get('/', checkAuth, UserController.user_get_all);

router.post('/signup', UserController.user_signup);

router.post('/login', UserController.user_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;
