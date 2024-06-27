const DocumentModel = require('../models/documentModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const UserBookModel = require('../models/userBookModel');
const BookModel = require('../models/BookModel');

exports.updateProgress = catchAsync(async (req, res, next) => {
  if (req?.query?.type === 'document') {
    const document = await DocumentModel.findByIdAndUpdate(
      {
        _id: req.params.id,
        user: req.user._id,
      },
      { progress_page: req.body.page, active_date: Date.now() },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      progress_page: document.progress_page,
    });
  } else if (req?.query?.type === 'book') {
    const book = await UserBookModel.findOneAndUpdate(
      {
        book: req.params.id,
        user: req.user._id,
      },
      { progress_page: req.body.page, active_date: Date.now() },
      { new: true },
    );

    res.status(200).json({
      status: 'success',
      progress_page: book.progress_page,
      progress_percentage: parseFloat(
        (book.progress_page / book.book_pages).toFixed(2),
      ),
    });
  }
});

exports.recentReadingActivitiy = catchAsync(async (req, res, next) => {
  if (req?.query?.type === 'document') {
    const documents = await DocumentModel.find({
      user: req.user._id,
    })
      .sort('-active_date')
      .limit(parseInt(req?.query?.count) || 3);

    res.status(200).json({
      status: 'success',
      data: { documets: documents },
    });
  } else if (req?.query?.type === 'book') {
    const books = await UserBookModel.find({ user: req.user._id })
      .populate('book')
      .sort('-active_date')
      .limit(parseInt(req?.query?.count) || 3)
      .lean();

    for (let i = 0; i < books.length; ++i) {
      books[i].progress_percentage = parseFloat(
        (books[i].progress_page / books[i].book_pages).toFixed(2),
      );
    }

    res.status(200).json({
      status: 'success',
      data: { books: books },
    });
  } else {
    const documents = await DocumentModel.find({
      user: req.user._id,
    })
      .sort('-active_date')
      .limit(parseInt(req?.query?.count) || 3)
      .lean();

    for (let i = 0; i < documents.length; ++i) {
      documents[i].type = 'document';
    }

    const books = await UserBookModel.find({ user: req.user._id })
      .populate('book')
      .sort('-active_date')
      .limit(parseInt(req?.query?.count) || 3)
      .lean();

    for (let i = 0; i < books.length; ++i) {
      books[i].progress_percentage = parseFloat(
        (books[i].progress_page / books[i].book_pages).toFixed(2),
      );
      books[i].type = 'book';
    }

    const list = getFilesSortedByDate(books, documents);
    const listTop = list.slice(0, parseInt(req?.query?.count) || 3);

    res.status(200).json({
      status: 'success',
      data: listTop,
    });
  }
});

exports.recommendationBooks = catchAsync(async (req, res, next) => {
  const books = await BookModel.find().lean();

  // to mark in the library if book in the favorites of the user or not
  for (let i = 0; i < books.length; ++i) {
    const userBook = await UserBookModel.findOne({
      user: req.user._id,
      book: books[i]._id,
    });

    if (userBook !== null) {
      books[i].favourite = true;
    } else {
      books[i].favourite = false;
    }
  }

  // Sort the list based on 'favourite' and then 'recommendation' fields
  books.sort((a, b) => {
    // First sort by 'favourite' (false before true)
    if (!a.favourite && b.favourite) {
      return -1; // b should come before a
    } else if (a.favourite && !b.favourite) {
      return 1; // a should come before b
    } else {
      // If 'favourite' values are the same, sort by 'recommendation' descending
      return b.recommendation - a.recommendation;
    }
  });

  const recommendationBooks = books.slice(0, parseInt(req.query.count) || 3);

  res.status(200).json({
    status: 'success',
    length: parseInt(req.query.count) || 3,
    books: recommendationBooks,
  });
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

// Helper function to parse date and sort
const getFilesSortedByDate = (books, docs) => {
  // Combine the lists
  const combinedList = [...books, ...docs];

  // Sort the combined list by active_date in descending order
  combinedList.sort(
    (a, b) => new Date(b.active_date) - new Date(a.active_date),
  );

  return combinedList;
};
