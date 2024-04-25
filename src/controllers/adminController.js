const catchAsync = require('./../utils/catchAsync');
const User = require('./../models/userModel');
const Admin = require('./../models/adminModel');

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
  const admin = await Admin.findOneAndDelete({ admin: req.body.admin });

  if (!admin) {
    return res.status(404).json({
      status: 'fail',
      message: 'the one you need to remove is not an admin!',
    });
  }

  let user;
  if (admin.active === true) {
    user = await User.findOneAndUpdate(
      { email: req.body.admin },
      { admin: false },
      { new: true },
    );
  }

  return res.status(203).json({
    status: 'sucess',
    message: 'admin authority deleted from the user',
    data: {
      user,
    },
  });
});
