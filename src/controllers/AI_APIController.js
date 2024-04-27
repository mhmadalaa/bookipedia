const axios = require('axios');
const Book = require('./../models/BookModel');
const Document = require('./../models/documentModel');
const pdfService = require('./../services/pdfService');
const AI_API = process.env.AI_API;
const BACKEND = process.env.BACKEND;

exports.addFileToAI = async (req, res, next) => {
  console.log(req.fileId, req.fileType);
  const file_id = req.fileId;
  const ocr = req.fileType === 'document';

  const url = `${BACKEND}/ai-api/file`;

  axios
    .post(`${AI_API}/add_document/${file_id}?url=${url}/${file_id}`)
    .then(function (response) {
      console.log(response.data);
      console.log('response zaee elfoll');
    })
    .catch(function (error) {
      console.log(error.message);
      console.log('y3amee error');
    });
};

// serve pdf files to ai-api
exports.serveFile = async (req, res, next) => {
  req.fileId = req.params.id;
  pdfService.displayFile(req, res, next);
};
