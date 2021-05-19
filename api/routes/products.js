const { error } = require('console');
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/products');

router.get('/', (req, res, next) => {
  // getting all the products from db
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      // if (docs > 0) {
      res.status(200).json(docs);
      // } else {
      //   res.status(404).json({
      //     message: 'No Product Available',
      //   });
      // }
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: 'Handling GET request to /products',
  // });
});

router.post('/', (req, res, next) => {
  // creating new product to post
  // const product = {
  //   productName: req.body.productName,
  //   productPrice: req.body.productPrice,
  // };
  // storing data to db
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    productPrice: req.body.productPrice,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      // sucess case
      res.status(201).json({
        message: 'Handling POST request to /products',
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;

  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log('From the database', doc);
      if (doc) {
        res.status(200).json(doc);
      } else {
        // for valid id but null
        res.status(404).json({
          message: 'No valid entry found for provided ID',
        });
      }
    })
    .catch((err) => {
      console.log(err);
      // for invalid id that does not exist
      res.status(500).json({ error: err });
    });
  // if (id === 'special') {
  //   res.status(200).json({
  //     message: 'You discovered the special id',
  //     ID: id,
  //   });
  // } else {
  //   res.status(200).json({
  //     message: 'You passed an id',
  //   });
  // }
});

router.patch('/:productId', (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne(
    { _id: id },
    {
      $set: updateOps,
    }
  )
    .exec()
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
  // res.status(200).json({
  //   message: `Updated Product ${id} `,
  // });
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });
  // res.status(200).json({
  //   message: `Deleted Product ${id} `,
  // });
});

module.exports = router;
