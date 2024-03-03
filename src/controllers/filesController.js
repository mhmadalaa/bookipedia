const { GridFSBucket, MongoClient } = require('mongodb');
// const {bookipediaConnection} = require('./../db/connections');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('bson');
const CoverImageModel = require('./../models/ImageModel');
const mongoose = require('mongoose');

const db = mongoose.connection;
const bucket = new GridFSBucket(db);

// const bucket = new GridFSBucket(bookipediaConnection);

const url = process.env.DATABASE;
const client = new MongoClient(url);

exports.uploadFile = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.file || req.files.file.length === 0) {
    deleteImage(req, res, next);
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const fileBuffer = req.files.file[0].buffer; // Access the file buffer
  const filename = `${Date.now()}${req.files.file[0].originalname}`;
  const uploadStream = bucket.openUploadStream(filename);
  const id = uploadStream.id;
  req.fileId = id;
  uploadStream.end(fileBuffer); // Write the file buffer to the stream

  uploadStream.on('finish', () => {
    next();
  });

  uploadStream.on('error', async (error) => {
    deleteImage(req, res, next);
    res.status(500).json({ error: 'Error uploading file to GridFS' });
  });
});

exports.uploadImage = catchAsync(async (req, res, next) => {
  if (
    !req.files ||
    !req.files.coverImage ||
    req.files.coverImage.length === 0
  ) {
    return res.status(400).json({ error: 'No image uploaded' });
  }
  const cover = await CoverImageModel.create({
    imageName: `${Date.now()}${req.files.coverImage[0].originalname}`,
    imageBuffer: req.files.coverImage[0].buffer,
  });
  req.coverImage_id = cover._id;
  next();
});

exports.displayFile = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const fileId = new ObjectId(req.fileId);
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

exports.deleteFile = catchAsync(async (req, res, next) => {
  const files = await client.db().collection('fs.files');
  const chuncks = await client.db().collection('fs.chunks');
  const fileId = new ObjectId(req.fileId);
  await files.deleteOne({ _id: fileId });
  await chuncks.deleteMany({ files_id: fileId });
  deleteImage(req, res, next);
});

const deleteImage = catchAsync(async (req, res, next) => {
  await CoverImageModel.findByIdAndDelete(req.coverImage_id);
});
