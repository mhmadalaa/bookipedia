/*
isAdmin?
then you can add another admin 
or remove the admin you added 

signup as admin
login as admin

*/

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const User = require('./../models/userModel');
const Admin = require('./../models/AdminModel');

exports.addAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.create({
    superadmin: req.user._id,
    admin: req.body.newAdmin,
    createdAt: Date.now(),
  });

  return res.status(200).json({
    status: 'sucess',
    message: 'a new admin has been added',
    data: {
      admin,
    },
  });
});

exports.removeAdmin = catchAsync(async (req, res, next) => {
  return res.status(200).json({
    status: 'sucess',
    message: 'from remove admin func',
  });
});
