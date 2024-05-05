const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: [true, 'there must be a question sent'],
  },
  answer: {
    type: String,
  },
  sources: {
    type: String,
  },
  chat_id: {
    type: mongoose.Schema.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    index: true, // index the date to retrieve the chat according to it
  },
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
