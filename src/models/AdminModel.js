const mongoose = require('mongoose');
const validator = require('validator');

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
    required: true,
    default: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const Admin = mongoose.model('Admin', AdminSchema);

module.exports = Admin;
