const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const hashOtp = require('../utils/hashOtp');
const otpGenerator = require('otp-generator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    minlength: [2, 'User name must be at least 2 characters'],
    maxlength: [15, 'User name must be at most 15 characters'],
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
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    minlength: 8,
    validate: {
      validator: function (val) {
        return this.password === val;
      },
      message: 'Please, check if password is the same.',
    },
  },
  passwordChangedAt: {
    type: Date,
    required: false,
  },
  otp :String ,
  otpExpires :Date ,
  createdAt :Date ,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
  authenticated: {
    type: Boolean,
    default: false,
  },
  books: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Book', // TODO: ref in mongoos
    },
  ],
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
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

userSchema.methods.createOtp = function () {
  const Otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  this.otp = hashOtp(Otp);

  this.otpExpires = Date.now() + 5 * 60 * 1000;

  return Otp;
};

module.exports = mongoose.model('User', userSchema);
