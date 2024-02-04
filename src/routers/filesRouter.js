const express = require('express');
const filesController = require('../controllers/filesController');

const router = express.Router();


router.post('/upload', filesController.uploadSingleFile, filesController.uploadFile);
router.get('/uploadedfiles/:id', filesController.displayFile);
router.get('/',filesController.getFiles);
router.get('/filesTitles', filesController.getFilesTitles);
router.route('/:id').get(filesController.getCertainFile).delete(filesController.deleteFile);


module.exports = router;