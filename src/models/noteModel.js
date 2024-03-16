const mongoose = require('mongoose');
const bookModel = require('./BookModel');
const documentModel = require('./documentModel');
const AppError = require('./../utils/appError');

const noteSchema = new mongoose.Schema({

  type :{
    type :String ,
    enum :['book' ,'document']
  } ,
  content :{
    type :String ,
    required :[true ,'You must provide content for this note']
  } ,
  page :{
    type :Number ,
    required :[true ,'You must provide page number for this note']
  } ,
  user : {
    type :mongoose.Schema.ObjectId ,
    ref :'User'
  } ,
  createdAt : Date  ,
  document: {
    type: mongoose.Schema.ObjectId,
    ref: 'Document', 
  },
  book: {
    type: mongoose.Schema.ObjectId,
    ref: 'Book', 
  }
});


noteSchema.pre('save', function (next) {
  const document = this.document ? 1 : 0;
  const book = this.book ? 1 : 0;
  if (!(document ^ book)) {
    return next(
      new AppError(
        'Please provide one reference either for book or document',
      ),
    );
  }

  next();
});

noteSchema.pre('save' ,async function (next) {
  if (this.type === 'Book') {
    const book = await bookModel.findById(this.book);
    if (!book) {
      return next(
        new AppError(
          'There is no book with that id',
        ),
      );
    }
  }
  else {
    const document = await documentModel.findById(this.document);
    if (!document) {
      return next(
        new AppError(
          'There is no document with that id',
        ),
      );
    }
  }
  next();
});

const noteModel = mongoose.model('note' ,noteSchema);

module.exports = noteModel;