const filesController = require('./filesController');
const catchAsync = require('./../utils/catchAsync');
const BookModel = require('./../models/BookModel');


exports.createBook = async(req , res ,next) => {
  try {
    if (!req.files || !req.files.coverImage || req.files.coverImage.length === 0) {
      return res.status(400).json({ error: 'No image uploaded' });
    }
    const book = await BookModel.create({
      title :req.body.title ,
      author :req.body.author ,
      pages:req.body.pages,
      size :req.body.size,
      chapters:req.body.chapters,
      category : req.body.category ,
      coverImage:`${Date.now()}${req.files.coverImage[0].originalname}`,
      imageBuffer :req.files.coverImage[0].buffer,
      file_id:req.fileId ,
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
  //Note if the title book updated the slug would not be updated 
  const book = await BookModel.findByIdAndUpdate(req.params.id ,req.body ,{
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

exports.getCoverImages = catchAsync(async (req ,res ,next) => {
  const coverImages = await BookModel.find().select({coverImage :1 ,imageBuffer:1});
  if (coverImages.length === 0) { 
    return res.status(404).json({
      message : 'No cover images found'
    });
  }
  res.status(200).json({
    length :coverImages.length ,
    CoverImages : coverImages
  });

});

/* exports.getOneImage = catchAsync(async(req ,res ,next) => {
  const book = await BookModel.findById(req.params.id);
  res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on your file type
  res.setHeader('Content-Disposition', 'inline; filename="image.jpg"'); // Adjust the filename and disposition as needed

  res.status(200).send(book.imageBuffer);

}); */