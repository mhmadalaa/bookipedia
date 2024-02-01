const express = require('express');
const questionController = require('../controllers/questionController');
const textToSpeechController = require('../controllers/textToSpeechController');

const router = express();

router.route('/question').get(questionController.askQuestion);
router.route('/tts').get(textToSpeechController.textToSpeech);

module.exports = router;
