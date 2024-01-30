const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'there must be a question sent'],
  },
  answer: {
    // not required from client it's ai-answer-filed
    type: String,
  },
  document: {
    type: String, // FIXME: temporary
    // type: mongoose.Schema.ObjectId,
    // ref: 'Document',
  },
  book: {
    type: String, // FIXME: temporary
    // type: mongoose.Schema.ObjectId,
    // ref: 'Book',
  },
  user: {
    type: String, // FIXME: temporary
    // type: mongoose.Schema.ObjectId,
    // ref: 'User',
    // required: [true, 'Question must belong to a user!'],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

questionSchema.pre('save', async function (next) {
  // to save either a book or a document with each question
  // and never accept (book and document) or (neither document or book)
  // because as a logic each question must belong to a refrence and must be one refrence
  const document = this.document ? 1 : 0;
  const book = this.book ? 1 : 0;
  if (!(document ^ book)) {
    return next(
      new AppError(
        'Please provide one refrence either for book or document! and resend the question',
      ),
    );
  }

  next();
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
