const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const ChapterSummary = require('../models/chSummaryModel');
const Book = require('./../models/BookModel');

const chapterSummaryFiltering = (req) => {
  return {
    title: req.body.title,
    content: req.body.content,
    book: req.params.book_id,
    chapter: req.params.chapter,
    createdAt: Date.now(),
  };
};

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const book = await Book.findById(
    new mongoose.Types.ObjectId(req.params.book_id),
  );
  req.params.chapter = parseInt(req.params.chapter);

  if (book === null) {
    next(new AppError('That is not an avilable book'), 404);
  } else if (req.params.chapter <= 0 || req.params.chapter > book.chapters) {
    next(
      new AppError(
        `That is not an avilable chapter in this book, availabe from ${1} to ${book.chapters}`,
      ),
      404,
    );
  }

  next();
});

exports.createChapterSummary = catchAsync(async (req, res, next) => {
  const summary = await ChapterSummary.create(chapterSummaryFiltering(req));

  res.status(202).json({
    message: 'success',
    summary,
  });
});

exports.updateChapterSummary = catchAsync(async (req, res, next) => {
  await ChapterSummary.findOneAndUpdate(
    { book: req.params.book_id, chapter: req.params.chapter },
    chapterSummaryFiltering(req),
  );

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

  res.status(202).json({
    message: 'success',
    summary,
  });
});

exports.deleteChapterSummary = catchAsync(async (req, res, next) => {
  await ChapterSummary.findOneAndDelete({
    book: req.params.book_id,
    chapter: req.params.chapter,
  });

  res.status(200).json({
    message: 'success',
  });
});

exports.getChapterSummary = catchAsync(async (req, res, next) => {
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

exports.isBookAvilable = catchAsync(async (req, res, next) => {
  const book = await Book.findById(
    new mongoose.Types.ObjectId(req.params.book_id),
  );

  if (book === null) {
    next(new AppError('That is not an avilable book'), 404);
  }

  next();
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

exports.availableSummaries = catchAsync(async (req, res) => {
  let chapters = await ChapterSummary.aggregate([
    {
      $match: {
        book: new mongoose.Types.ObjectId(req.params.book_id),
      },
    },
    {
      $group: {
        _id: '$chapter', // Group by chapter field
      },
    },
    {
      $project: {
        _id: 0, // Exclude _id field
        chapter: '$_id', // Project the _id field as chapter
      },
    },
  ]);

  chapters = chapters.map((chapter) => chapter.chapter); // Extract the chapter field from the result

  res.status(200).json({
    message: 'success',
    chapters,
  });
});
