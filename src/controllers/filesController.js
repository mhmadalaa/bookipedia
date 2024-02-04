const multer = require('multer');
const { GridFSBucket, MongoClient } = require('mongodb');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('bson');
const mongoose = require('mongoose');
const {BookepidiaConnection} = require('./../connections'); 


//const DB = mongoose.connection;
const bucket = new GridFSBucket(BookepidiaConnection);

const url = process.env.DATABASE;
const client = new MongoClient(url);

const storage = multer.memoryStorage();
const upload = multer({ storage });

exports.uploadSingleFile = upload.single('file');

exports.uploadFile = (req, res, next) => {
  try {
    const fileBuffer = req.file.buffer; // Access the file buffer
    const filename = req.file.originalname;

    const uploadStream = bucket.openUploadStream(filename);
    const id = uploadStream.id;

    uploadStream.end(fileBuffer); // Write the file buffer to the stream

    uploadStream.on('finish', () => {
      res.json({ id: id, filename: filename });
    });

    uploadStream.on('error', (error) => {
      res.status(500).json({ error: 'Error uploading file to GridFS' });
    });
  } catch (error) {
    res.status(error.status).json({ error });
  }
};

exports.displayFile = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const fileId = new ObjectId(req.params.id);
  const file = await files.findOne({ _id: fileId });
  if (!file) {
    return res.status(404).json({
      message: 'File not found',
    });
  }
  const downloadStream = bucket.openDownloadStream(fileId);

  // Set appropriate headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'inline; filename=example.pdf');

  // Pipe the file stream to the response
  downloadStream.pipe(res);
});

exports.getFiles = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const metadata = await files.find().toArray();
  if (metadata.length === 0) {
    return res.status(404).json({
      message: 'No files found',
    });
  }
  res.status(200).json({
    length: metadata.length,
    metadata,
  });
});

exports.getFilesTitles = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const filesTitle = await files.find().project({ filename: 1 }).toArray();
  if (filesTitle.length === 0) {
    return res.status(404).json({
      message: 'No books found',
    });
  }
  res.status(200).json({
    length: filesTitle.length,
    filesTitle,
  });
});

exports.getCertainFile = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const fileId = new ObjectId(req.params.id);
  const file = await files.findOne({ _id: fileId });
  if (!file) {
    return res.status(404).json({
      message: 'File not found',
    });
  }
  res.status(200).json({
    file,
  });
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const chuncks = await client.db().collection('fs.chunks');
  const fileId = new ObjectId(req.params.id);
  await files.deleteOne({ _id: fileId });
  await chuncks.deleteMany({ files_id: fileId });
  res.status(204).json({
    message: 'Deleted Successfully',
  });
});
