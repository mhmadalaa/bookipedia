const DocumentModel = require('./../models/documentModel');
const catchAsync = require('./../utils/catchAsync');

const multer = require('multer');

const storage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Please upload only PDF files'), false);
  }
};
const upload = multer({
  storage,
  fileFilter: multerFilter,
});

exports.configMulter = upload.fields([{ name: 'file', maxCount: 1 }]);

exports.createDocument = catchAsync(async (req, res, next) => {
  const document = await DocumentModel.create({
    original_id: req.fileId,
    ocr_id: req.fileId,
    user: '65cfa8d7673213203967414c',
  });

  res.status(202).json({
    msg: 'sucess',
    document,
  });
});
