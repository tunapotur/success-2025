const Success = require('./../models/successModel');
const factory = require('./handlerFactory');
// const catchAsync = require('../utils/catchAsync');

exports.setSuccessUserIds = (req, res, next) => {
  if (!req.body.success) req.body.user = req.user.id;

  next();
};

// exports.getAllSuccesses = catchAsync(async (req, res, next) => {
//   const doc = await Success.find();

//   // SEND RESPONSE
//   res.status(200).json({
//     status: 'success',
//     results: doc.length,
//     data: {
//       data: doc,
//     },
//   });
// });

exports.getAllSuccesses = factory.getAll(Success);
exports.getSuccess = factory.getOne(Success);
exports.createSuccess = factory.createOne(Success);
