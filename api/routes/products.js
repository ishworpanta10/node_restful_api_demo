const express = require('express');

const router = express.Router();

const ProductController = require('../controller/products');

// for storing the files using multer

const multer = require('multer');

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

// for auth jwt
const checkAuth = require('../middleware/check_auth');

router.get('/', ProductController.products_get_all);

router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductController.product_post
);

router.get('/:productId', ProductController.product_get);

router.patch(
  '/:productId',
  checkAuth,
  // upload.single('productImage'),
  ProductController.product_update
);

router.delete('/:productId', checkAuth, ProductController.product_delete);

module.exports = router;
