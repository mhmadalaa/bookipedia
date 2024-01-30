const mongoose = require('mongoose');
const multer = require('multer');
const { GridFSBucket, MongoClient } = require('mongodb');
const catchAsync = require('./../utils/catchAsync');
const { ObjectId } = require('bson');

const db = mongoose.connection;
const bucket = new GridFSBucket(db);

const url = process.env.DATABASE;
const client = new MongoClient(url);

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadSingleFile = upload.single('file');

exports.uploadBook = (req, res, next) => {
  try {
    const fileBuffer = req.file.buffer; // Access the file buffer
    const filename = req.file.originalname;

    const uploadStream = bucket.openUploadStream(filename);
    const id = uploadStream.id;

    uploadStream.end(fileBuffer); // Write the file buffer to the stream

    uploadStream.on('finish', () => {
      res.json({ id: id, filename: filename });
    });

    /*  uploadStream.on('error', (error) => {
             res.status(500).json({ error: 'Error uploading file to GridFS' });
         }); */
  } catch (error) {
    res.status(error.status).json({ error });
  }
};

exports.displayBook = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const fileId = new ObjectId(req.params.id);
  const book = await files.findOne({ _id: fileId });
  if (!book) {
    return res.status(404).json({
      message: 'Book not found',
    });
  }
  const downloadStream = bucket.openDownloadStream(fileId);

  // Set appropriate headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=example.pdf');

  // Pipe the file stream to the response
  downloadStream.pipe(res);
});

exports.getBooks = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const metadata = await files.find().toArray();
  if (metadata.length === 0) {
    return res.status(404).json({
      message: 'No books found',
    });
  }
  res.status(200).json({
    length: metadata.length,
    metadata,
  });
});

exports.getBooksTitles = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const booksTitle = await files.find().project({ filename: 1 }).toArray();
  if (booksTitle === 0) {
    return res.status(404).json({
      message: 'No books found',
    });
  }
  res.status(200).json({
    length: booksTitle.length,
    booksTitle,
  });
});

exports.getCertainBook = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const fileId = new ObjectId(req.params.id);
  const book = await files.findOne({ _id: fileId });
  if (!book) {
    return res.status(404).json({
      message: 'Book not found',
    });
  }
  res.status(200).json({
    book,
  });
});

exports.deleteBook = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const chuncks = await client.db().collection('fs.chunks');
  const fileId = new ObjectId(req.params.id);
  await files.deleteOne({ _id: fileId });
  await chuncks.deleteMany({ files_id: fileId });
  res.status(204).json({
    message: 'Deleted Successfully',
  });
});
