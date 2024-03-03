const express = require('express');
const documentController = require('./../controllers/documentController');
const fileController = require('./../controllers/filesController');

const router = express();

router
  .route('/')
  .post(
    // fileController.uploadFilesByMulter,
    fileController.uploadFile,
    documentController.createDocument,
  );

module.exports = router;
