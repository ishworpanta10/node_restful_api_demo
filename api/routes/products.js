const { error } = require('console');
const express = require('express');

const router = express.Router();

const mongoose = require('mongoose');

const Product = require('../models/products');

// for storing the files using multer

const multer = require('multer');

// for auth jwt
const checkAuth = require('../middleware/check_auth');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + '_' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    // accept file
    cb(null, true);
  } else {
    //reject a file
    cb(null, false);
    // we can pass Error("Err Msg") instead of null also
  }
};

const upload = multer({
  storage: storage,
  limits: {
    // 1024 * 1024 = 1Mb * 5 = 5mb
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

router.get('/', (req, res, next) => {
  // getting all the products from db
  Product.find()
    .select('_id  productName productPrice productImage')
    .exec()
    .then((docs) => {
      const response = {
        count: docs.length,
        products: docs.map((doc) => {
          return {
            _id: doc._id,
            productName: doc.productName,
            productPrice: doc.productPrice,
            productImage: doc.productImage,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id,
            },
          };
        }),
      };
      // console.log(docs);
      // if (docs > 0) {
      res.status(200).json(response);
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

router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  // creating new product to post
  // const product = {
  //   productName: req.body.productName,
  //   productPrice: req.body.productPrice,
  // };
  console.log(req.file);

  // storing data to db
  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    productName: req.body.productName,
    productPrice: req.body.productPrice,
    productImage: req.file.path,
  });

  product
    .save()
    .then((result) => {
      console.log(result);
      // sucess case
      res.status(201).json({
        message: 'created product successfully',
        createdProduct: {
          productName: result.productName,
          productPrice: result.productPrice,
          productImage: result.productImage,
          _id: result._id,
          request: {
            type: 'GET',
            url: 'http://localhost:3000/products/' + result._id,
          },
        },
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
    .select('_id productName productPrice productImage')
    .exec()
    .then((doc) => {
      console.log('From the database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: 'Get all products',
            url: 'http://localhost:3000/products',
          },
        });
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

router.patch('/:productId', checkAuth, (req, res, next) => {
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
      res.status(200).json({
        message: 'Product Updated',
        request: {
          type: 'GET',
          url: 'http://localhost:3000/products/' + id,
        },
      });
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

router.delete('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.remove({ _id: id })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: 'Product Deleted',
        request: {
          type: 'POST',
          url: 'http://localhost:3000/products',
          body: {
            productName: 'String',
            productPrice: 'Number',
          },
        },
      });
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
