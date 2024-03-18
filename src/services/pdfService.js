const mongoose = require('mongoose');
const { GridFSBucket, MongoClient } = require('mongodb');
const catchAsync = require('../utils/catchAsync');
const fs = require('fs');
const db = mongoose.connection;
const bucket = new GridFSBucket(db);


const url = process.env.DATABASE;
const client = new MongoClient(url);

exports.uploadFile = catchAsync(async (req, res, next) => {
  if (!req.files || !req.files.file || req.files.file.length === 0) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  fs.readFile(req.files.file[0].path ,(err , data) => {
    if (err) {
      return res.status(500).json({ error: 'Error during convert the file to buffer' });
    }
    else if (data) {
      const fileBuffer = data; 
      const filename = req.files.file[0].originalname;
      
      const uploadStream = bucket.openUploadStream(filename);
      const id = uploadStream.id;
      req.fileId = id;

      uploadStream.end(fileBuffer); 

      uploadStream.on('finish', () => {
        fs.unlink(req.files.file[0].path ,(err) => {
          if (err) {
            console.error(err);
          }
        }); 
        next();
      });

      uploadStream.on('error', async (error) => {
        res.status(500).json({ error: 'Error uploading file to GridFS' });
      });
    }
  });
});

exports.displayFile = catchAsync(async (req, res, next) => {
  const files = client.db().collection('fs.files');
  const fileId = new mongoose.Types.ObjectId(req.fileId);
  const file = await files.findOne({ _id: fileId });

  if (!file) {
    return res.status(404).json({
      message: 'File not found',
    });
  }

  const downloadStream = bucket.openDownloadStream(fileId);

  // Set appropriate headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=${file.filename}`);

  // Pipe the file stream to the response
  downloadStream.pipe(res);
});

exports.deleteFile = catchAsync(async (req, res, next) => {
  const files = client.db().collection('fs.files');
  const chuncks = client.db().collection('fs.chunks');
  const fileId = new mongoose.Types.ObjectId(req.fileId);

  await files.deleteOne({ _id: fileId });
  await chuncks.deleteMany({ files_id: fileId });

});
