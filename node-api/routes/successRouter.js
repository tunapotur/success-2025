const express = require('express');
const authController = require('../controllers/authController');
const successController = require('../controllers/successController');

const router = express.Router({ mergeParams: true });

// router.use(authController.protect);

router
  .route('/')
  .get(successController.getAllSuccesses)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    successController.setSuccessUserIds,
    successController.createSuccess,
  );

router.route('/:id').get(successController.getSuccess);

module.exports = router;
