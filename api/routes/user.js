const mongoose = require('mongoose');

const express = require('express');

const router = express.Router();

const bcrypt = require('bcrypt');

const User = require('../models/user');

// getting all users info
router.get('/', (req, res, next) => {
  User.find()
    .select('_id email')
    .exec()
    .then((users) => {
      const response = {
        count: users.length,
        user: users.map((user) => {
          return {
            _id: user._id,
            email: user.email,
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
});

router.post('/signup', (req, res, next) => {
  const plainPassword = req.body.password;
  const email = req.body.email;

  User.find({ email: email })
    .exec()
    .then((result) => {
      // here result is not going to be null it is empty array
      // so we cannot just check for result
      if (result.length >= 1) {
        return res.status(409).json({
          message: 'Email already exists',
        });
      } else {
        bcrypt.hash(plainPassword, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: email,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                console.log('created user', result);

                res.status(201).json({
                  message: 'User Created Successfully',
                  user: result,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
});

router.post('/login', (req, res, next) => {
  User.find({ email: req.body.email })
    // we can also use findone to get sigle user not array
    .exec()
    .then((user) => {
      // here user is in array but we can have only one because we filter unique email in signup
      if (user.length < 1) {
        // if no user email exist in db
        return res.status(200).json({
          message: 'Authorization Failed',
        });
      }
      // for password
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(200).json({
            message: 'Authentication Failed',
          });
        }
        if (result) {
          res.status(200).json({
            message: 'Authentication Success',
          });
        }
        res.status(200).json({
          message: 'Authentication Failed',
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete('/:userId', (req, res, next) => {
  const id = req.params.userId;
  User.findByIdAndRemove({ _id: id })
    .exec()
    .then((result) => {
      if (result) {
        res.status(200).json({
          message: 'User deleted successfully',
          user: result,
        });
      } else {
        res.status(200).json({
          message: 'User does not exists',
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
});

module.exports = router;
