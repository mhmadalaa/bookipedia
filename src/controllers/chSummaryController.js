const catchAsync = require('../utils/catchAsync');
const ChapterSummary = require('../models/chSummaryModel');
const AppError = require('../utils/appError');

const chapterSummaryFiltering = (req) => {
  return {
    title: req.body.title,
    content: req.body.content,
    book: req.params.book_id,
    chapter: req.params.chapter,
  };
};

exports.createChapterSummary = catchAsync(async (req, res) => {
  const summary = await ChapterSummary.create(chapterSummaryFiltering(req));

  res.status(202).json({
    message: 'success',
    summary,
  });
});

exports.updateChapterSummary = catchAsync(async (req, res) => {
  await ChapterSummary.findOneAndUpdate(
    { book: req.params.book_id, chapter: req.params.chapter },
    chapterSummaryFiltering(req),
  );

  const summary = await ChapterSummary.findOne({
    book: req.params.book_id,
    chapter: req.params.chapter,
  });

  res.status(202).json({
    message: 'success',
    summary,
  });
});

exports.getChapterSummary = catchAsync(async (req, res, next) => {
  const bookChapters = 15; // FIXME: assume that all books has `15` chapters until we connect with book model

  // case of unavilable chapter
  if (req.params.chapter <= 0 || req.params.chapter > bookChapters) {
    return next(
      new AppError(
        `That is not an avilable chapter in this book, availabe from ${1} to ${bookChapters}`,
        404,
      ),
    );
  }

  // query book chapters summary
  const summary = await ChapterSummary.findOne({
    book: req.params.book_id,
    chapter: req.params.chapter,
  });

  // case where AI not generate summary for this chapter
  if (summary === null) {
    return next(
      new AppError(
        'Sorry, summary for this chapter not avilabe right now.',
        404,
      ),
    );
  }

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
