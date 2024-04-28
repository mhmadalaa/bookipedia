const axios = require('axios');
const pdfService = require('./../services/pdfService');
const AI_API = process.env.AI_API;
const BACKEND = process.env.BACKEND;

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

/*
  update chat_summary endpoint to accept the updated chat_summary with each new question

  router in AI_APIRoute.js can be  `PATCH /chat-summary/:chat_id`
  chat_id is sent from ai-api which is the Chat model id
  we wil: 
    search in Chat model with `req.params.chat_id`
    and update the content of chat_summary in it 
*/

// serve pdf files to ai-api
exports.serveFile = async (req, res, next) => {
  req.fileId = req.params.id;
  pdfService.displayFile(req, res, next);
};
