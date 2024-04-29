const express = require('express');
const pdfService = require('./../services/pdfService');
const AI_APIController = require('./../controllers/AI_APIController');

const router = express.Router();

router.route('/file/:id').get(AI_APIController.serveFile);

router
  .route('/ocr-file/:id')
  .post(
    AI_APIController.configMulter,
    pdfService.uploadFile,
    AI_APIController.OCRFile,
  );

router
  .route('/chat-summary/:id')
  .patch(AI_APIController.updateChatSummary);

module.exports = router;
