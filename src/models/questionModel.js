const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'there must be a question sent'],
  },
  answer: {
    type: String,
    required: [true, 'there must be an answer'],
  },
  document: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document',
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book',
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Question must belong to a user!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

questionSchema.pre('save', function (next) {
  if (!this.document && !this.book) {
    return next(
      new AppError(
        'Please provide the book or the document id! and resend the question',
        404,
      ),
    );
  }

  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
