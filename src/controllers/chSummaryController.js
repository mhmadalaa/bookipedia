const catchAsync = require('../utils/catchAsync');
const ChapterSummary = require('../models/chSummaryModel');

exports.createChapterSummary = catchAsync(async (req, res) => {
  const summary = await ChapterSummary.create(req.body);

  res.status(202).json({
    message: 'success',
    summary,
  });
});

// TODO: it's needed to know the number of chapters in each book from book model
exports.getChapterSummary = catchAsync(async (req, res) => {
  const summary = await ChapterSummary.findOne({
    book: req.params.book_id,
    chapter: req.params.chapter,
  });

  res.status(200).json({
    message: 'success',
    summary,
  });
});

exports.bookChaptersSummary = catchAsync(async (req, res) => {
  const summaries = await ChapterSummary.find({
    book: req.params.book_id,
  });

  res.status(200).json({
    message: 'success',
    summaries,
  });
});
