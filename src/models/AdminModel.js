const mongoose = require('mongoose');
const validator = require('validator');
const otpGenerator = require('otp-generator');

const hashOtp = require('../utils/hashOtp');

const AdminSchema = new mongoose.Schema({
  superadmin: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Enter a a valid id'],
  },
  admin: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: 'Enter a valid email',
    },
  },
  active: {
    type: Boolean,
    default: false,
  },
  loginOtp: { type: String },
  loginOtpExpires: { type: Date },
  createdAt: {
    type: Date,
    required: true,
  },
});

AdminSchema.methods.createOtp = function () {
  const Otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  this.loginOtp = hashOtp(Otp);

  this.loginOtpExpires = Date.now() + 24 * 60 * 60 * 1000;

  return Otp;
};

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
