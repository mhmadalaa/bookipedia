const express = require('express');
const questionController = require('../controllers/questionController');
const textToSpeechController = require('../controllers/textToSpeechController');
const chapterSummaryController = require('../controllers/chSummaryController');

const router = express();

router.route('/question').get(questionController.askQuestion);
router.route('/tts').get(textToSpeechController.textToSpeech);

//TODO: specifiy the role of users who can POST in this route
router.route('/ch-summary').post(chapterSummaryController.createChapterSummary);

module.exports = router;
