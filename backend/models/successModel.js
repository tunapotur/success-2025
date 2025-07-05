const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');

const successSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Success must have date!'],
    },
    header: {
      type: String,
      required: [true, 'Success must have a header!'],
      maxlength: [
        96,
        'A success header name must have less or equal then 96 characters',
      ],
      minlength: [
        12,
        'A success header name must have more or equal then 12 characters',
      ],
    },
    detail: {
      type: String,
      required: [true, 'Success must have detail!'],
      maxlength: [
        4096,
        'A success detail name must have less or equal then 4096 characters',
      ],
      minlength: [
        48,
        'A success detail name must have more or equal then 48 characters',
      ],
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Success must belong to a User!'],
    },
  },
  {
    timestamps: true,
  },
);

successSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'name email',
  });

  next();
});

const Success =
  mongoose.models.Success || mongoose.model('Success', successSchema);

module.exports = Success;
