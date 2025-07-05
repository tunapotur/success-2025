const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const successRouter = require('../routes/successRouter');

const router = express.Router();

router.get('/:id', userController.getUserSimpleInfos);
router.use('/:userId/successList', successRouter);

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);

// Protect all routes after this middleware
router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUserDetailInfos);
router.patch('/updateMyPassword', authController.updatePassword);
router.patch('/updateMe', userController.updateMe);
router.delete('/deleteMe', userController.deleteMe);

router.use(authController.restrictTo('admin'));

router.route('/allUsers').get(userController.getAllUsers);

router
  .route('/restrict/:id')
  .get(userController.getUserDetailInfos)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
