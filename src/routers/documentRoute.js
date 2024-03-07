const express = require('express');
const documentController = require('../controllers/documentController');
const pdfService = require('../services/pdfService');

const router = express();

router.get('/file/:id', documentController.displayDocument);

router
  .route('/')
  .post(
    documentController.configMulter,
    pdfService.uploadFile,
    documentController.createDocument,
  )
  .get(documentController.getAllDocuments);

router.route('/:id').delete(documentController.deleteDocument);

module.exports = router;
