const axios = require('axios');
const Book = require('./../models/BookModel');
const Document = require('./../models/documentModel');
const pdfService = require('./../services/pdfService');
const AI_API = process.env.AI_API;
const BACKEND = process.env.BACKEND;

exports.addFileToAI = async (req, res, next) => {
  /*
    doc_id = from user req book or document, we the search in one of them to extract
              the required file, this is a required to search for actually
      TODO: file_type book or document

      // request body
  */

  let ocr, file_id;
  if (req.query.type === 'book') {
    const book = await Book.findById(req.params.id);
    file_id = book.file_id;
    ocr = false;
  } else if (req.query.type === 'document') {
    const document = await Document.findById(req.params.id);
    file_id = document.file_id;
    ocr = true;
  }

  const url = `${BACKEND}/ai-file`; // FIXME: REPLACE IT WITH OUR URL

  axios
    .post(`${AI_API}/add_document/${file_id}?url=${url}/${file_id}`)
    .then(function (response) {
      console.log(response.status, '\n', response.data);
      console.log('response zaee elfoll');
    })
    .catch(function (error) {
      console.log(error.message);
      console.log('y3amee error');
    });
};

// /ai-file/id
exports.serveFile = async (req, res, next) => {
  req.fileId = req.params.id;
  pdfService.displayFile(req, res, next);
};

// TODO: add ai router, rendr .env in pr