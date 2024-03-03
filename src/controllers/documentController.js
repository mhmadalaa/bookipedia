const DocumentModel = require('./../models/documentModel');
const catchAsync = require('./../utils/catchAsync');

exports.createDocument = catchAsync(async (req, res, next) => {
  const doc = await DocumentModel.create(req.body);

  res.status(202).json({
    doc,
  });
});
