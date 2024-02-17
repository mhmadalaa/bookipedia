const filesController = require('./filesController');
const catchAsync = require('./../utils/catchAsync');
const BookModel = require('./../models/BookModel');
const CoverImageModel = require('./../models/ImageModel');

exports.createBook = async(req , res ,next) => {
  try {
    const book = await BookModel.create({
      title :req.body.title ,
      author :req.body.author ,
      pages:req.body.pages,
      size :req.body.size,
      chapters:req.body.chapters,
      category : req.body.category ,
      file_id:req.fileId ,
      coverImage_id : req.coverImage_id,
      description:req.body.description
    });
    res.status(201).json({
      message :'Created book successfully' ,
      book
    });
  }
  catch (err) {
    filesController.deleteFile(req , res , next);
    next(err);
  }
};

exports.deleteBook = catchAsync(async(req , res ,next) => {
  const book = await BookModel.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  req.fileId = book.file_id;
  filesController.deleteFile(req , res , next);
  res.status(204).json({
    message :'Book is deleted successfully'
  });
});

exports.getAllBooks = catchAsync(async(req , res ,next) => {
  const books = await BookModel.find();
  if (books.length === 0) { 
    return res.status(404).json({
      message : 'No books found'
    });
  }
  res.status(200).json({
    length :books.length ,
    Books : books
  });   
});

exports.getCertainBook = catchAsync(async(req , res ,next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  res.status(200).json({
    book
  }); 
});

exports.updateBook = catchAsync(async(req , res ,next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  Object.keys(req.body).forEach((e) => {
    book[e] = req.body[e];
  });
  await book.save({validateBeforeSave :true});
  res.status(200).json({
    book
  });
});

exports.displayBook = catchAsync (async (req ,res ,next) => {
  const book = await BookModel.findById(req.params.id);
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  req.fileId = book.file_id;
  filesController.displayFile(req, res, next);
});

exports.getBooksTitles = catchAsync (async (req ,res ,next) => { 
  const books = await BookModel.find().select('title');
  if (books.length === 0) { 
    return res.status(404).json({
      message : 'No books found'
    });
  }
  res.status(200).json({
    length :books.length ,
    Books : books
  }); 
});

exports.getCoverImages = catchAsync(async (req , res , next) => {
  const coverImages = await CoverImageModel.find();
  res.status(200).json({
    length : coverImages.length ,
    Covers : coverImages 
  });
});