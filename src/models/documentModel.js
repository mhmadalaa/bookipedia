const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
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
    default: Date.now(),
  },
});

const DocumentModel = mongoose.model('Document', documentSchema);

module.exports = DocumentModel;
