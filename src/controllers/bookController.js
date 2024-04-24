const fs = require('fs');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const pdfService = require('../services/pdfService');
const { uploadImage, deleteImage } = require('../services/imageService');
const BookModel = require('../models/BookModel');
const User = require('../models/userModel');
const path = require('path');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      cb(null, path.resolve('./src/public/img/covers'));
    } else if (file.mimetype === 'application/pdf') {
      cb(null, path.resolve('./src/public/books'));
    }
  },
  filename: function (req, file, cb) {
    if (file.mimetype.startsWith('image/')) {
      const uniquename = `${Date.now()}_${file.originalname}`;
      cb(null, uniquename);
    } else if (file.mimetype === 'application/pdf') {
      const uniquename = `${Date.now()}_${file.originalname}`;
      cb(null, uniquename);
    }
  },
});

const multerFilter = (req, file, cb) => {
  if (
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/pdf'
  ) {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images or PDF files'), false);
  }
};
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

exports.configMulter = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'file', maxCount: 1 },
]);

exports.createBook = async (req, res, next) => {
  try {
    const book = await BookModel.create({
      title: req.body.title,
      author: req.body.author,
      pages: req.body.pages,
      size: req.body.size,
      chapters: req.body.chapters,
      category: req.body.category,
      file_id: req.fileId,
      description: req.body.description,
      createdAt: Date.now(),
    });
    req.book = book;

    next();
  } catch (err) {
    pdfService.deleteFile(req, res, next);
    next(err);
  }
};

exports.uploadCoverImage = catchAsync(async (req, res, next) => {
  if (!req.files) return next();
  const imagePath = path.resolve(req.files.coverImage[0].path);
  const { public_id, url } = await uploadImage(imagePath);

  req.public_id = public_id;
  req.url = url;

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.error(err);
    }
  });

  next();
});

exports.getAllBooks = catchAsync(async (req, res, next) => {
  const books = await BookModel.find();
  if (books.length === 0) {
    return res.status(404).json({
      message: 'No books found',
    });
  }

  res.status(200).json({
    length: books.length,
    Books: books,
  });
});

exports.getCertainBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }

  res.status(200).json({
    book,
  });
});

exports.updateBook = catchAsync(async (req, res, next) => {
  if (req.body.createdAt) req.body.createdAt = Date.now();

  await BookModel.updateOne({ _id: req.params.id }, req.body, {
    runValidators: true,
  });

  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }

  res.status(200).json({
    book,
  });
});

exports.displayBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }

  req.fileId = book.file_id;
  pdfService.displayFile(req, res, next);
});

exports.getBooksTitles = catchAsync(async (req, res, next) => {
  const books = await BookModel.find().select('title');
  if (books.length === 0) {
    return res.status(404).json({
      message: 'No books found',
    });
  }

  res.status(200).json({
    length: books.length,
    Books: books,
  });
});

exports.deleteCoverImage = catchAsync(async (req, res, next) => {
  const filename = req.params.id;
  try {
    fs.unlinkSync(`./src/public/img/covers/${filename}.jpeg`);
  } catch (error) {
    return next(new AppError('cover image not found', 404));
  }

  res.status(204).json({
    message: 'Book is deleted successfully',
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findByIdAndDelete(req.params.id);

  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }
  req.fileId = book.file_id;
  pdfService.deleteFile(req, res, next);

  next();
});

exports.addUserBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $addToSet: { books: req.params.id } },
    { new: true },
  );

  res.status(202).json({
    message: 'Book is added successfully to the user',
    booksList: user.books,
  });
});

exports.removeUserBook = catchAsync(async (req, res, next) => {
  const book = await BookModel.findById(req.params.id);

  if (!book) {
    return res.status(404).json({
      message: 'No book found',
    });
  }

  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { books: req.params.id } },
    { new: true },
  );

  res.status(202).json({
    message: 'Book is removed successfully from the user',
    booksList: user.books,
  });
});
