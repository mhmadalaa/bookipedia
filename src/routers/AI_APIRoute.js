const express = require('express');
const AI_APIController = require('./../controllers/AI_APIController');

const router = express.Router();

router.route('/file/:id').get(AI_APIController.serveFile);

module.exports = router;
