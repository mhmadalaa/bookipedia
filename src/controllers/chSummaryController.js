const catchAsync = require('../utils/catchAsync');
const ChapterSummary = require('../models/chSummaryModel');

exports.createChapterSummary = catchAsync(async (req, res) => {
  const chsummary = await ChapterSummary.create(req.body);

  res.status(202).json({
    message: 'success',
    chsummary,
  });
});
