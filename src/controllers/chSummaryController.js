const catchAsync = require('../utils/catchAsync');
const ChapterSummary = require('../models/chSummaryModel');
const AppError = require('../utils/appError');
const mongoose = require('mongoose');

const chapterSummaryFiltering = (req) => {
  return {
    title: req.body.title,
    content: req.body.content,
    book: req.params.book_id,
    chapter: req.params.chapter,
  };
};

const checkChapterAvailability = (req, res) => {
  // TODO: get the book chapters from book model
  //       const bookChapters = await BookModel.findById(req.params.book_id);
  const bookChapters = 15; // FIXME: assume that all books has `15` chapters until we connect with book model

  // case of unavilable chapter
  if (req.params.chapter <= 0 || req.params.chapter > bookChapters) {
    res.status(404).json({
      message: 'fail',
      content: `That is not an avilable chapter in this book, availabe from ${1} to ${bookChapters}`,
    });

    return 0;
  }

  return 1;
};

exports.createChapterSummary = catchAsync(async (req, res, next) => {
  // check if this chapter available in this book
  if (!checkChapterAvailability(req, res)) return; // TODO: check await while link with book model

  const summary = await ChapterSummary.create(chapterSummaryFiltering(req));

  res.status(202).json({
    message: 'success',
    summary,
  });
});

exports.updateChapterSummary = catchAsync(async (req, res, next) => {
  // check if this chapter available in this book
  if (!checkChapterAvailability(req, res)) return; // TODO: check await while link with book model

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

exports.getChapterSummary = catchAsync(async (req, res, next) => {
  // check if this chapter available in this book
  if (!checkChapterAvailability(req, res)) return; // TODO: check await while link with book model

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
