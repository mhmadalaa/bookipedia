const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  file_id: {
    type: mongoose.Schema.ObjectId,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // TODO: ref in mongoose
    required: [true, 'Document must belong to a user!'],
  },
  aiApplied: {
    type: Boolean,
    default: false,
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

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = DocumentModel;
