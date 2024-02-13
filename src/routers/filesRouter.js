const express = require('express');
const filesController = require('../controllers/filesController');

const router = express.Router();


router.get('/uploadedfiles/:id', filesController.displayFile);
router.get('/',filesController.getFiles);
router.route('/:id').get(filesController.getCertainFile);


module.exports = router;