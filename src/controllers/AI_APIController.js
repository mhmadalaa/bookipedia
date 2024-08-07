const axios = require('axios');
const pdfService = require('./../services/pdfService');
const DocumentModel = require('../models/documentModel');
const chatModel = require('../models/chatModel');
const FileType = require('../models/fileTypeModel');
const BookModel = require('../models/BookModel');
const FileTypeModel = require('../models/fileTypeModel');
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

exports.addFileToAI = async (req) => {
  const file_id = req.fileId;
  const lib_doc = req.fileType === 'book';

  const url = `${BACKEND}/ai-api/file`;

  try {
    await axios.post(
      `${AI_API}/add_document/${file_id}?url=${url}/${file_id}?lib_doc=${lib_doc}`,
    );

    console.log(`↪ AI start processing the uploaded file ${file_id} ✔`);
  } catch (error) {
    console.error(
      `✗ There is an error while sending process file ${file_id} request to ai-api!!`,
    );
  }
};

/*
  when document/book being deleted we need to notify ai-api
  so they easily remove these files embeddings
*/
exports.deleteAIFile = async (fileId) => {
  try {
    await axios.delete(`${AI_API}/delete_document/${fileId}`);

    // delete the associated entities if the file deleted from our api
    await FileTypeModel.deleteOne({ file_id: fileId });

    console.log(`↪ file ${fileId} deleted from AI successfully ✔`);
  } catch (error) {
    console.error(
      `✗ Error while sending delete file ${fileId} request to ai-api!!`,
    );
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
    const updatedFileId = req.fileId;
    const document = await DocumentModel.findOneAndUpdate(
      { file_id: req.params.id },
      { file_id: req.fileId },
    );

    // update the file_type model ⟹ to change the file_id refrence to the new one
    await FileTypeModel.findOneAndUpdate(
      { file_id: req.params.id },
      { file_id: req.fileId },
    );

    // doucment object is not the updated one so we access the old file_id and delet it
    req.fileId = document.file_id;
    pdfService.deleteFile(req, res, next);

    console.log('↪ File updated after ocr applied ✔');

    res.status(202).json({
      message: 'success, ocr-file updated.',
      file_id: updatedFileId,
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

    console.log('↪ chat summary update after ai-question ✔');

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

/*
  acknowledge that ai applied to specific file
  ai-api will send an acknowledgemnt with the `file_id`

  but the problem we have is that what is the file_id type?? doucment or book 
  so, we will create a file_type database model 
  that when a document or a book uploaded
  it will add a new entitity the file_id is unique and the file type for each id
  so, when ai-api send a file_id we easily can configure the file type 
  and go to either the Document or Book model to mark that `: true` 
*/
exports.aiApplied = async (req, res, next) => {
  try {
    const file_id = req.params.id;

    const file = await FileType.findOne({ file_id: file_id });

    if (file.file_type === 'book') {
      await BookModel.findByIdAndUpdate(file.file_type_id, { aiApplied: true });
    } else if (file.file_type === 'document') {
      await DocumentModel.findByIdAndUpdate(file.file_type_id, {
        aiApplied: true,
      });
    }

    console.log(`↪ file ${file_id} is marked that ai applied to it ✔`);

    res.status(202).json({
      message: `success, file ${file_id} is marked that ai applied to it`,
    });
  } catch (error) {
    console.error(
      '✗ There is an error while mark if ai is applied to a file!!\n',
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
