const multer = require('multer');
const { GridFSBucket, MongoClient } = require('mongodb');
const {bookipediaConnection} = require('./../connections');
const catchAsync = require('../utils/catchAsync');
const { ObjectId } = require('bson');


/* const DB = mongoose.connection; */
const bucket = new GridFSBucket(bookipediaConnection);

const url = process.env.DATABASE;
const client = new MongoClient(url);

const storage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Please upload only images or PDF files'), false);
  }
};
const upload = multer({ 
  storage ,
  fileFilter :multerFilter });

exports.uploadFilesByMulter = upload.fields([
  { name: 'coverImage', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]);  


exports.uploadFile = async (req, res, next) => {
  if (!req.files || !req.files.file || req.files.file.length === 0) {
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

  uploadStream.on('error', (error) => {
    res.status(500).json({ error: 'Error uploading file to GridFS' });
  });
};

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
  
});
