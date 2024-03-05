const userModel = require('./../models/userModel');
const sendEmail = require('./../utils/email');
const hashToken = require('./../utils/hashToken');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const catchAsync = require('./../utils/catchAsync');

const createSendToken = (res, status, user) => {
  const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
    expiresIn: process.env.EXPIRE_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
  };

  res.cookie('jwt', token, cookieOptions);

  res.status(status).json({
    status: 'success',
    user,
    token,
  });
};

const sendEmailWithToken = async (user ,token ,res) => {
  try {
    await sendEmail({
      email:user.email,
      subject: 'Email Confirm',
      message: `That's a 10 minutes valid token ${token} to Confirm your Email`,
    });
  
    res.status(200).json({
      status: 'success',
      message: 'An email will be send to complete the steps',
      token,
    });
  } catch (err) {
    user.tokenExpires = undefined;
    user.token = undefined;
    user.save({ validateBeforeSave: false });
    res.status(500).json({
      status: 'fail',
      message:
            'There is an error while sending the email, pleas try again!',
    });
  }
};

exports.signup = catchAsync(async (req, res ,next) => {
  
  const newUser = await userModel.create({
    name: req.body.name,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    email: req.body.email,
  });
  newUser.authenticated = false;

  const confirmToken = newUser.createToken();
  newUser.save({ validateBeforeSave: false });

  try {
    await sendEmail({
      email:newUser.email,
      subject: 'Email Confirm',
      message: `That's a 10 minutes valid token ${confirmToken} to Confirm your Email`,
    });

    res.status(200).json({
      status: 'success',
      message: 'An email will be send to complete the steps',
      newUser
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

  const hashedToken = hashToken(req.body.token);

  const user = await userModel.findOne({
    token: hashedToken,
    tokenExpires: { $gt:Date.now() },
  });
  if (!user) {
    return res.status(401).json({
      status :'fail' ,
      'message' :'Token is invalide or has been expired!'
    });
  }

  user.authenticated = true;
  user.token = undefined;
  user.tokenExpires = undefined;
  await user.save({ validateBeforeSave: false });

  createSendToken(res, 201, user);
});

exports.resendToken = catchAsync(async (req , res , next) => {
 
  const user = await userModel.findOne({email :req.body.email});
  if (!user) {
    return res.status(404).json({
      status :'fail' ,
      'message' :'There is no user with that email address'
    });
  }
  const confirmToken = user.createToken();
  user.save({validateBeforeSave:false});

  sendEmailWithToken(user ,confirmToken , res);
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
  createSendToken(res, 200, user);
});

exports.isLogin = catchAsync(async (req, res, next) => {
  
  if (req.headers.cookie === undefined || req.headers.cookie.split('=')[1] === 'logout') {
    return res.status(401).json({
      status: 'fail',
      message: 'You must be logged in to access this page',
    });
  }

  const token = req.headers.cookie.split('=')[1];
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

exports.logout = (req, res) => {
  const cookieOptions = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };

  res.cookie('jwt', 'logout', cookieOptions);
  res.status(200).json({ status: 'success' });
};

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

// FORGOT AND REST PASSWORD IS FOR CHANGING THE PASSWORD THAT THE USER CAN'T REMEMBER
exports.forgetPassword = async (req, res, next) => {
  
  const user = await userModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      status: 'fail',
      message: 'There is no user with this email address!',
    });
  }
  const resetToken = user.createToken();
  user.save({ validateBeforeSave: false });
  sendEmailWithToken(user ,resetToken , res);

};

exports.resetPassword = catchAsync(async (req, res, next) => {
  
  const hashedToken = hashToken(req.body.resetToken);

  const user = await userModel.findOne({
    token: hashedToken,
    tokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token is invalide or has been expired!',
    });
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  if (user.password && user.password === user.passwordConfirm) {
    user.token = undefined;
    user.tokenExpires = undefined;
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
  const resetToken = user.createToken();
  user.save({ validateBeforeSave: false });
  sendEmailWithToken(user ,resetToken , res);

});


exports.resetEmail = catchAsync(async (req, res, next) => {

  const hashedToken = hashToken(req.body.resetToken);

  const user = await userModel.findOne({
    emailResetToken: hashedToken,
    emailResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(401).json({
      status: 'fail',
      message: 'Token is invalide or has been expired!',
    });
  }

  user.email = req.body.email;

  if (user.email) {
    user.token = undefined;
    user.tokenExpires = undefined;
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

// UPDATE THE PASSWORD FOR THE LOGGED IN USER WHO KNOW THE CURRENT PASSWORD
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
    user.save({ validateBeforeSave: false });
  } else {
    return res.status(400).json({
      status: 'fail',
      message: 'Password is invalide or not match the confirmation.',
    });
  }
  createSendToken(res, 200, user);
});
