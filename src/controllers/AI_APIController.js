const axios = require('axios');
const pdfService = require('./../services/pdfService');
const DocumentModel = require('../models/documentModel');
const chatModel = require('../models/chatModel');
const AI_API = process.env.AI_API;
const BACKEND = process.env.BACKEND;

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
  fileFilter: multerFilter,
});

exports.configMulter = upload.fields([{ name: 'file', maxCount: 1 }]);

exports.addFileToAI = async (req, res, next) => {
  const file_id = req.fileId;
  const lib_doc = req.fileType === 'book';

  const url = `${BACKEND}/ai-api/file`;

  try {
    const response = await axios.post(
      `${AI_API}/add_document/${file_id}?url=${url}/${file_id}?lib_doc=${lib_doc}`,
    );

    return { message: 'success', data: response.data };
  } catch (error) {
    return { message: 'error' };
  }
};

/*
  ocr-pdf endpoint to accept the updated document pdf that ocr applied to it

  router in AI_APIRoute.js can be  `POST /ocr-pdf/:pdf_id`
  pdf_id: is the pdf id sent from ai-api
  so we will: 
    uplaod the pdf to gridfs and hold the new id as example: `req.update_fileId = _id`
    then ⟹ search in `Document` model wehere `file_id = req.params.pdf_id`
    then ⟹ remove the old pdf and set the `file_id: req.update_fileId`
*/
exports.OCRFile = async (req, res, next) => {
  try {
    // update the file id in document to the new file
    // req.fileId is comming from pdfService upload function that applied as a middleware
    const document = await DocumentModel.findOneAndUpdate(
      { file_id: req.params.id },
      { file_id: req.fileId },
    );

    // doucment object is not the updated one so we access the old file_id and delet it
    req.fileId = document.file_id;
    pdfService.deleteFile(req, res, next);

    console.log('↪ File updated after ocr applied ✔');

    res.status(202).json({
      message: 'success, ocr-file updated.',
    });
  } catch (error) {
    console.error(
      '✗ There is an error while updating the ocr file!!\n',
      error.message,
    );

    res.status(404).json({
      message: 'fail',
      error: error.message,
    });
  }
};

/*
  update chat_summary endpoint to accept the updated chat_summary with each new question

  router in AI_APIRoute.js can be  `PATCH /chat-summary/:chat_id`
  chat_id is sent from ai-api which is the Chat model id
  we wil: 
    search in Chat model with `req.params.chat_id`
    and update the content of chat_summary in it 
*/
exports.updateChatSummary = async (req, res, next) => {
  try {
    await chatModel.findByIdAndUpdate(req.params.id, {
      chat_summary: req.body.chat_summary,
    });

    console.log('↪ chat summary update after an ai-question ✔');

    res.status(202).json({
      message: 'success, chat summary updated.',
    });
  } catch (error) {
    console.error(
      '✗ There is an error while updating the chat summary!!\n',
      error.message,
    );

    res.status(404).json({
      message: 'fail',
      error: error.message,
    });
  }
};

// serve pdf files to ai-api
exports.serveFile = async (req, res, next) => {
  req.fileId = req.params.id;
  pdfService.displayFile(req, res, next);
};
