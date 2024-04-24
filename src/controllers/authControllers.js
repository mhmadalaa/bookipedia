const userModel = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const hashOtp = require('./../utils/hashOtp');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');

const AppError = require('./../utils/appError');
const Admin = require('../models/AdminModel');


const createSendToken = (res, status, user) => {
  let token;
  if (user.admin === true) {
    token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.ADMIN_JWT_EXPIRE_IN,
    });
  } else {
    token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
      expiresIn: process.env.EXPIRE_IN,
    });
  }

  res.status(status).json({
    status: 'success',
    user ,
    token
  });
};

const sendEmailWithOtp = async (user, otp ,res ,email) => {
  try {
    await sendEmail({
      email :email || user.email,
      subject: 'Email Confirm',
      message: `That's a 5 minutes valid otp ${otp} `,
    });
  
    res.status(200).json({
      status: 'success',
      message: 'An email will be send to complete the steps'
    });
  } 
  catch (err) {
    user.otpExpires = undefined;
    user.otp = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: 'fail',
      message:
            'There is an error while sending the email, pleas try again!',
    });
  }
};

exports.signup = catchAsync(async (req, res ,next) => {

  // check if this email is in admins list
  const admin = await Admin.findOne({ admin: req.body.email });

  if (admin !== null) {
    req.admin = true;
  } else {
    req.admin = false;
  }
  
  const newUser = await userModel.create({
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
    createdAt  : Date.now(),
    admin: req.admin,
  });
  newUser.authenticated = false;

  const otp = newUser.createOtp();
  await newUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email:newUser.email,
      subject: 'Email Confirm',
      message: `That's a 5 minutes valid otp ${otp} to Confirm your Email`,
    });

    res.status(200).json({
      status: 'success',
      message: 'An email will be send to complete the steps',
    });
  } catch (err) {
    await userModel.findByIdAndDelete(newUser._id);
    res.status(500).json({
      status: 'fail',
      message:
          'There is an error while sending the email, pleas signup again!',
    });
  }
});

exports.confirmSignup = catchAsync(async (req, res, next) => {

  const hashedOtp = hashOtp(req.body.otp);

  const user = await userModel.findOne({
    otp: hashedOtp,
    otpExpires: { $gt:Date.now() },
    authenticated :false
  });
  if (!user) {
    return res.status(401).json({
      status :'fail' ,
      'message' :'Otp is invalide or has been expired!'
    });
  }

  // activate the admin in admin list
  if (user.admin === true) {
    await Admin.findOneAndUpdate({ admin: user.email }, { active: true });
  }

  user.authenticated = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(res, 201, user);
});

exports.resendOtp = catchAsync(async (req , res , next) => {
 
  const user = await userModel.findOne({email :req.body.email});
  if (!user) {
    return res.status(404).json({
      status :'fail' ,
      'message' :'There is no user with that email address'
    });
  }
  if (user.authenticated) {
    return res.status(400).json({
      status :'fail' , 
      message :'Your account is already authenticated'
    });
  }
  const confirmOtp = user.createOtp();
  await user.save({validateBeforeSave:false});

  sendEmailWithOtp(user ,confirmOtp , res);
});

exports.login = catchAsync(async (req, res ,next) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({
      status: 'fail',
      message: 'You must provide an email address',
    });
  }

  if (!password) {
    return res.status(400).json({
      status: 'fail',
      message: 'You must provide a password',
    });
  }

  const user = await userModel.findOne({ email }).select('+password');

  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with that email ',
    });
  }
  if (!user.authenticated) {
    return res.status(401).json({
      status: 'fail',
      message: 'Your account is not verified . Please verify your account',
    });
  }
  if (!await user.correctPassword(password, user.password)) {
    return res.status(404).json({
      status: 'fail',
      message: 'The password is incorrect',
    });
  }
  if (user.admin === true) {
    return res.status(200).json({
      status: 'success',
      message:
        'Oh, your an admin! please confirm your login with daily admins otp code email.',
    });
  }

  createSendToken(res, 200, user);
});

exports.isLogin = catchAsync(async (req, res, next) => {

  if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer')) {
    return res.status(401).json({
      status: 'fail',
      message: 'You must be logged in to access this page',
    });
  }
  
  const token = req.headers.authorization.split(' ')[1];
  const decode = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
  const user = await userModel.findById(decode.id);
  if (!user || !user.authenticated) {
    return res.status(401).json({
      status: 'fail',
      message: 'User must Register or login to access this route',
    });
  }

  if (user.changedPasswordAfter(decode.iat)) {
    return res.status(401).json({
      status: 'fail',
      message: 'Password is incorrect',
    });
  }

  req.user = user;
  next();
});

exports.updateUser = catchAsync(async (req, res, next) => {

  if (req.body.email || req.body.password) {
    return res.status(401).json({
      status: 'fail',
      message:
        'You can not update curcial data with this regualar update router',
    });
  }

  const user = await userModel.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.isAdmin = catchAsync(async (req, res, next) => {
  const admin = await Admin.findOne({ admin: req.user.email, active: true });
  if (admin) {
    next();
  } else {
    next(new AppError('That is not an admin user', 404));
  }
});

exports.confirmAdminLogin = catchAsync(async (req, res, next) => {
  const hashedOtp = hashOtp(req.body.otp);

  const admin = await Admin.findOne({
    loginOtp: hashedOtp,
    loginOtpExpires: { $gt: Date.now() },
    admin: req.body.email,
  });
  if (!admin) {
    return res.status(401).json({
      status: 'fail',
      message: 'Otp is invalide or has been expired!',
    });
  }

  const user = await userModel.findOne({ email: req.body.email });

  createSendToken(res, 201, user);
});

exports.forgetPassword = async (req, res, next) => {
  
  const user = await userModel.findOne({ email: req.body.email , authenticated :true});
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with this email address!',
    });
  }
  const resetOtp = user.createOtp();
  await user.save({ validateBeforeSave: false });
  sendEmailWithOtp(user ,resetOtp , res);

};

exports.resetPassword = catchAsync(async (req, res, next) => {
  
  const hashedOtp = hashOtp(req.body.otp);

  const user = await userModel.findOne({
    otp: hashedOtp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Otp is invalide or has been expired!',
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  if (user.password && user.password === user.passwordConfirm) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({validateBeforeSave :false});
  } else {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is invalide or not match the confirmation!',
    });
  }
  createSendToken(res, 200, user);
});

exports.changeEmail = catchAsync(async (req, res, next) => {

  const user = await userModel.findById(req.user._id);
  const resetOtp = user.createOtp();
  await user.save({ validateBeforeSave: false });
  sendEmailWithOtp(user ,resetOtp , res , req.body.newEmail);

});


exports.resetEmail = catchAsync(async (req, res, next) => {

  const hashedOtp = hashOtp(req.body.otp);
  const user = await userModel.findOne({
    otp: hashedOtp,
    otpExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Otp is invalide or has been expired!',
    });
  }

  user.email = req.body.newEmail;

  if (user.email) {
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save({ validateBeforeSave: false });
  } 
  else {
    return res.status(400).json({
      status: 'fail',
      message: 'Provide a valid email!',
    });
  } 
  createSendToken(res, 200, user);
});


exports.updatePassword = catchAsync(async (req, res, next) => {

  const user = await userModel.findById(req.user._id).select('+password');
  if (
    !user ||
    !(await user.correctPassword(req.body.password, user.password))
  ) {
    return res.status(400).json({
      status: 'fail',
      message: 'This password is incorrect, try again.',
    });
  }
  if (req.body.newPassword === req.body.newPasswordConfirm) {
    user.password = req.body.newPassword;
    await user.save({ validateBeforeSave: false });
  } else {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is invalide or not match the confirmation.',
    });
  }
  createSendToken(res, 200, user);
});
