const mongoose = require('mongoose');
const AppError = require('../utils/appError');

const chatSchema = new mongoose.Schema({
  chat_summary: {
    type: String,
  },
  document: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document', // TODO: ref in mongoose
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book', // TODO: ref in mongoose
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // TODO: ref in mongoose
    required: [true, 'Chat must belong to a user!'],
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

chatSchema.pre('save', function (next) {
  // to save either a book or a document with each question
  // and never accept (book and document) or (neither document or book)
  // because as a logic each question must belong to a refrence and must be one refrence
  // so we do xor operation in book and document
  // if 1 ^ 1 = 0, 0 ^ 0 = 0, 1 ^ 0 = 1, 0 ^ 1 = 1
  // and that exactly what we need
  const document = this.document ? 1 : 0;
  const book = this.book ? 1 : 0;
  if (!(document ^ book)) {
    return next(
      new AppError('Please provide one refrence either for book or document!'),
    );
  }

  next();
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
