const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
  book_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // TODO: ref in mongoose
    required: [true, 'Document must belong to a user!'],
  },
  progress_page: {
    type: Number,
    default: 0,
  },
  book_pages: {
    type: Number,
    required: true,
  },
  active_date: {
    type: Date,
    default: function () {
      return this.createdAt;
    },
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

// add compound index to ensure the uniqueness of the compination of book and user
userBookSchema.index({ book_id: 1, user: 1 }, { unique: true });

const UserBook = mongoose.model('user-book', userBookSchema);

module.exports = UserBook;
