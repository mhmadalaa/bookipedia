const mongoose = require('mongoose');
const AppError = require('./../utils/appError');

const chSummarySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'provide the content of the summary'],
  },
  book: {
    // index the chapters book field because it's required alot
    // to search for chapter by the book id
    type: mongoose.Schema.ObjectId,
    ref: 'Book', // TODO: ref in mongoose
    required: [true, 'please specifiy the book.'],
    index: true,
  },
  chapter: {
    type: Number,
    required: [true, 'please specifiy the chapter of the book'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// Define compound index to ensure that
// each chapter in the book has only one summary stored
chSummarySchema.index({ book: 1, chapter: 1 }, { unique: true });

chSummarySchema.pre('save', async function (next) {
  // TODO: get the book chapters from book model
  //       const bookChapters = await BookModel.findById(this.book);

  const bookChapters = 15; // temporary

  // case of unavilable chapter
  if (this.chapter <= 0 || this.chapter > bookChapters) {
    return next(
      new AppError(
        `That is not an avilable chapter in this book, availabe from ${1} to ${bookChapters}`,
        404,
      ),
    );
  }

  next();
});

const ChapterSummary = mongoose.model('ChapterSummary', chSummarySchema);

module.exports = ChapterSummary;
