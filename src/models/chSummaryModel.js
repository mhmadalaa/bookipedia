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
    // type: String, // FIXME: temporary
    // TODO: ref in mongoose
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
    required: [true, 'please specifiy the book.'],
  },
  chapter: {
    // TODO: the chapter should be unique for each book
    type: Number,
    required: [true, 'please specifiy the chapter of the book'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const ChapterSummary = mongoose.model('ChapterSummary', chSummarySchema);

module.exports = ChapterSummary;
