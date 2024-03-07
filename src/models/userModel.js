const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const hashToken = require('./../utils/hashToken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User must have a name'],
    minlength: [5, 'User name must be at least 5 characters'],
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
    // select: false,
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
    // select: false,
  },
  passwordChangedAt: {
    type: Date,
    required: false,
  },
  token :String ,
  tokenExpires :Date ,

  createdAt :{
    type :Date ,
    default :Date.now()
  },
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


userSchema.methods.createToken = function () {
  const Token = crypto.randomBytes(32).toString('hex');

  this.token = hashToken(Token);

  this.tokenExpires = Date.now() + 10 * 60 * 1000;

  return Token;
};

module.exports = mongoose.model('User', userSchema);
