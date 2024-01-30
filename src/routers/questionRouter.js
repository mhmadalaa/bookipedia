const express = require('express');
const questionController = require('../controllers/questionController');

const router = express();
router.route('/question').post(questionController.SendQuestion);

module.exports = router;
