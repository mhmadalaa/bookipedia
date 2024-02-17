const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const hashToken = require('./../utils/hashToken');


// user schema
const users = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'User must have a name'],
    unique: true,
    minlength: [1, 'username should be 1-15 chars'],
    maxlength: [15, 'username should be 1-15 chars'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Enter a valid email',
    },
  },
  password: {
    type: String,
    required: [true, 'User must have a password'],
    minlength: 8,
    // select: false,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    validate: {
      // this validator function only works with ""SAVE""
      // so we need to use save in case of update or similars
      validator: function (val) {
        return this.password === val;
      },
      message: 'Please, check if password is the same.',
    },
    // select: false,
  },
  passwordChangedAt: {
    type: Date,
    required: false,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  emailResetToken: String,
  emailResetExpires: Date,
  emailCofirmToken: String,
  emailConfirmExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  authenticated: {
    type: Boolean,
    default: true,
    // select: false,
  },
});

/*
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined; // to be deleted after check if it's equal
  this.passwordChangedAt = Date.now();

  next();
});

// helper functions for authentication
userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    return this.passwordChangedAt.getTime() / 1000 > JWTTimestamp;
  }

  return false;
};

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = hashToken(resetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.emailResetToken = hashToken(resetToken);

  this.emailResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.createEmailConfirmToken = function () {
  const confirmToken = crypto.randomBytes(32).toString('hex');

  this.emailCofirmToken = hashToken(confirmToken);

  this.emailConfirmExpires = Date.now() + 10 * 60 * 1000;

  return confirmToken;
};

module.exports = mongoose.model('User', userSchema);
*/