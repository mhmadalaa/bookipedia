const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  original_id: {
    type: mongoose.Schema.ObjectId,
  },
  ocr_id: {
    type: mongoose.Schema.ObjectId,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User', // TODO: ref in mongoose
    required: [true, 'Document must belong to a user!'],
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = DocumentModel;
