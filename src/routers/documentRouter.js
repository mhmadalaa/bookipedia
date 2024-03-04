const express = require('express');
const documentController = require('./../controllers/documentController');
const fileController = require('./../controllers/filesController');

const router = express();

router.get('/file/:id', documentController.displayDocument);

router
  .route('/')
  .post(
    documentController.configMulter,
    fileController.uploadFile,
    documentController.createDocument,
  );

router.route('/:id').delete(documentController.deleteDocument);

module.exports = router;
