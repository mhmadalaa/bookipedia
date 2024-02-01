const express = require('express');
const questionController = require('../controllers/questionController');

const router = express();
router.route('/question').get(questionController.askQuestion);

module.exports = router;
