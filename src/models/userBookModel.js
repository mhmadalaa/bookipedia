const mongoose = require('mongoose');

const userBookSchema = new mongoose.Schema({
  file_id: {
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

const UserBook = mongoose.model('user-book', userBookSchema);

module.exports = UserBook;
