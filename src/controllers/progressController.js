const DocumentModel = require('../models/documentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const UserBookModel = require('../models/userBookModel');

exports.updateProgress = catchAsync(async (req, res, next) => {
  if (req?.query?.type === 'document') {
    const page = await DocumentModel.findByIdAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { progress_page: req.body.page, active_date: Date.now() },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      progress_page: page,
    });
  } else if (req?.query?.type === 'book') {
    // const page = await UserBookModel.findByIdAndUpdate(
    //   {
    //     _id: req.params.id,
    //     user: req.user._id,
    //   },
    //   { progress_page: req.body.page },
    //   { new: true },
    // );

    res.status(200).json({
      status: 'success',
      message: 'book progress',
      // progress_page: page,
      // progress_percentage: page /
    });
  }
});

exports.enforceQueryParams = (req, res, next) => {
  if (
    req.query &&
    (req.query.type === 'book' || req.query.type === 'document')
  ) {
    return next();
  }

  return next(
    new AppError(
      'Missing required query parameters, it should be in the form ?type=book or ?type=document',
      400,
    ),
  );
};
