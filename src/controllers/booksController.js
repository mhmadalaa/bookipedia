const bookModel = require('./../models/BookModel');
const catchAsync = require('./../utils/catchAsync');


exports.getAllBooks = catchAsync(async(req , res ,next) => {
  const books = await bookModel.find();
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
  const book = await bookModel.findById(req.params.id).populate('file_id');
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  res.status(200).json({
    book
  }); 

});
exports.createBook = catchAsync(async(req , res ,next) => {
  const book = await bookModel.create({
    title :req.body.title ,
    author :req.body.author ,
    pages:req.body.pages,
    size :req.body.size,
    chapters:req.body.chapters,
    file_id:req.body.file_id
  });
  res.status(201).json({
    message :'Created book successfully' ,
    book
  });
});
exports.updateBook = catchAsync(async(req , res ,next) => {
  const book = await bookModel.findByIdAndUpdate(req.params.id ,req.body ,{
    new :true, 
    runValidators :true
  });
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  res.status(200).json({
    book
  });
});
exports.deleteBook = catchAsync(async(req , res ,next) => {
  const book = await bookModel.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({
      message : 'No book found'
    });
  }
  res.status(204).json({
    message :'Book is deleted successfully'
  });
});

