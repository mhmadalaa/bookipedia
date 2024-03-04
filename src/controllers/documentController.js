const DocumentModel = require('./../models/documentModel');
const catchAsync = require('./../utils/catchAsync');
const filesController = require('./../controllers/filesController');

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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
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

exports.displayDocument = catchAsync(async (req, res, next) => {
  const document = await DocumentModel.findById(req.params.id);
  if (!document) {
    return res.status(404).json({
      message: 'No document found',
    });
  }

  req.fileId = document.ocr_id;
  filesController.displayFile(req, res, next);
});

exports.deleteDocument = catchAsync(async (req, res, next) => {
  const document = await DocumentModel.findByIdAndDelete(req.params.id);
  if (!document) {
    return res.status(404).json({
      message: 'No document found',
    });
  }

  req.fileId = document.original_id;
  filesController.deleteFile(req, res, next);
  res.status(204).json({
    message: 'document deleted successfully',
  });
});

exports.getAllDocuments = catchAsync(async (req, res, next) => {
  // FIXME: replace user with logged in user
  const user = '65cfa8d7673213203967414c';

  const documents = await DocumentModel.find({ user: user });
  if (documents.length === 0) {
    return res.status(404).json({
      message: 'No documents found',
    });
  }

  res.status(200).json({
    length: documents.length,
    documents: documents,
  });
});
