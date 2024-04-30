const mongoose = require('mongoose');

const fileTypeSchema = new mongoose.Schema({
  file_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Enter a a valid id'],
  },
  file_type: {
    type: String,
    enum: ['book', 'document'], // set that type is only one of these values
    required: true,
  },
  file_type_id: {
    type: mongoose.Schema.ObjectId,
    required: [true, 'Enter a a valid id either for a book or a document'],
  },
  createdAt: {
    type: Date,
    required: true,
  },
});

// update when a new file uploaded from ai in file type
const FileType = mongoose.model('file-type', fileTypeSchema);

module.exports = FileType;
