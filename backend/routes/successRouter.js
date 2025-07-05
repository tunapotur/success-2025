const express = require('express');
const authController = require('../controllers/authController');
const successController = require('../controllers/successController');

const router = express.Router({ mergeParams: true });

router.route('/').get(successController.getAllSuccesses);
router.route('/:id').get(successController.getSuccess);

router.use(authController.protect, authController.restrictTo('user'));

router
  .route('/')
  .post(successController.setSuccessUserIds, successController.createSuccess);

router
  .route('/:id')
  .patch(successController.updateSuccess)
  .delete(successController.deleteSuccess);

module.exports = router;
