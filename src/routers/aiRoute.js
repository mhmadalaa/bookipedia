const express = require('express');
const questionController = require('../controllers/questionController');
const textToSpeechController = require('../controllers/textToSpeechController');
const chapterSummaryController = require('../controllers/chSummaryController');

const router = express();

router.route('/question').get(questionController.askQuestion);
router.route('/tts').get(textToSpeechController.textToSpeech);

/*
TODO: 
  1. specifiy the role of users who can POST in this route
  2. take in care the param id of the book in post chapter summary
*/
router.route('/ch-summary').post(chapterSummaryController.createChapterSummary);

router
  .route('/ch-summary/:book_id')
  .get(chapterSummaryController.bookChaptersSummary);

router
  .route('/ch-summary/:book_id/:chapter')
  .get(chapterSummaryController.getChapterSummary);

module.exports = router;
