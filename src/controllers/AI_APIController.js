const axios = require('axios');
const pdfService = require('./../services/pdfService');
const AI_API = process.env.AI_API;
const BACKEND = process.env.BACKEND;

exports.addFileToAI = async (req, res, next) => {
  const file_id = req.fileId;
  const ocr = req.fileType === 'document';

  const url = `${BACKEND}/ai-api/file`;

  try {
    const response = await axios.post(
      `${AI_API}/add_documnt/${file_id}?url=${url}/${file_id}`,
    );

    return { message: 'success', data: response.data };
  } catch (error) {
    return { message: 'error' };
  }
};

// serve pdf files to ai-api
exports.serveFile = async (req, res, next) => {
  req.fileId = req.params.id;
  pdfService.displayFile(req, res, next);
};
