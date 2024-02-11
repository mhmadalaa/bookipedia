const mongoose = require('mongoose');

const chSummarySchema = new mongoose.Schema({
  title: {
    type: String,
  },
  content: {
    type: String,
    required: [true, 'provide the content of the summary'],
  },
  book: {
    // TODO: ref in mongoose
    // index the chapters book field because it's required alot
    // to search for chapter by the book id
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
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

const ChapterSummary = mongoose.model('ChapterSummary', chSummarySchema);

module.exports = ChapterSummary;
