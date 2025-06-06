const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxLength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      index: true,
      unique: true,
      lowercase: true,
      trim: true,
      maxLength: 120,
      validator: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      require: [true, 'Please confirm your password'],
      validate: {
        // This only works on CREATE and SAVE!!!
        validator: function (el) {
          return el === this.password;
        },
        message: 'Passwords are not the same!',
      },
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    theme: {
      type: String,
      enum: ['system', 'dark', 'light'],
      default: 'system',
    },
    // TODO: mongoose timestamp özelliği property'lerin update olduğu tarihide kaydediyor. Bunu incele bu şekilde bir düzenlemeye git.
    passwordChangedAt: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// active değeri false olan kullanıcılar görüntülenmez
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

//TODO kullanıcı şifresini güncelleme ile ilgili sorun olacaktır. Bunu düzelt.

// export default mongoose.models.User || mongoose.model('User', userSchema);

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
