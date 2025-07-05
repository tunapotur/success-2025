const Success = require('./../models/successModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setSuccessUserIds = (req, res, next) => {
  if (!req.body.success) req.body.user = req.user.id;

  next();
};

exports.getAllSuccesses = factory.getAll(Success);
exports.getSuccess = factory.getOne(Success);
exports.createSuccess = factory.createOne(Success);
exports.updateSuccess = factory.updateOne(Success);
exports.deleteSuccess = factory.deleteOne(Success);
