const mongoose = require('mongoose');

const fileTypeSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Enter a a valid id'],
  },
  type: {
    String,
    enum: ['book', 'document'], // set that type is only one of these values
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

const FileType = mongoose.model('file-type', fileTypeSchema);

module.exports = FileType;
