const DocumentModel = require('./../models/documentModel');
const catchAsync = require('./../utils/catchAsync');
const pdfService = require('./../services/pdfService');
const AI_APIController = require('./../controllers/AI_APIController');
const fileTypeController = require('./../controllers/fileTypeController');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('./src/public/documents'));
  },
  filename: function (req, file, cb) {
    const uniquename = `${Date.now()}_${file.originalname}`;
    cb(null, uniquename);
  },
});

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
    title: req.files.file[0].originalname,
    file_id: req.fileId,
    user: req.user._id,
    createdAt: Date.now(),
    active_date: Date.now(),
  });

  // add `req.fileType` to identify to ai-api if the file may need to apply ocr or not
  // and for fileTypeController that add a file type for each file_id
  req.fileType = 'document';
  req.fileTypeId = document._id;

  fileTypeController.addFileType(req);
  await AI_APIController.addFileToAI(req);

  res.status(202).json({
    message: 'sucess',
    document,
  });
});

exports.displayDocument = catchAsync(async (req, res, next) => {
  const document = await DocumentModel.findOne({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!document) {
    return res.status(404).json({
      message: 'No document found for this user with that id!',
    });
  }

  req.fileId = document.file_id;
  pdfService.displayFile(req, res, next);
});

exports.deleteDocument = catchAsync(async (req, res, next) => {
  const document = await DocumentModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user._id,
  });

  if (!document) {
    return res.status(404).json({
      message: 'No document found for this user with the given id',
    });
  }

  req.fileId = document.file_id;
  await AI_APIController.deleteAIFile(document.file_id);
  pdfService.deleteFile(req, res, next);
  res.status(204).json({
    message: 'document deleted successfully',
  });
});

exports.getAllDocuments = catchAsync(async (req, res, next) => {
  const user = req.user._id;

  const documents = await DocumentModel.find({ user: user }).sort(
    '-active_date',
  );

  res.status(200).json({
    length: documents.length,
    documents: documents,
  });
});
