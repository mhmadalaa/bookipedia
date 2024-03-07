const express = require('express');
const questionController = require('../controllers/questionController');
const textToSpeechController = require('../controllers/textToSpeechController');
const chapterSummaryController = require('../controllers/chSummaryController');

const router = express();

// in question and chat there will be query strnig in req `?type=book` or `?type=document`
router
  .route('/question/:id')
  .get(questionController.enforceQueryParams, questionController.askQuestion);
router
  .route('/chat/:id')
  .get(questionController.enforceQueryParams, questionController.reteriveChat);
router.route('/tts').get(textToSpeechController.textToSpeech);

/*
TODO: 
  1. specifiy the role of users who can POST, UPDATE, DELETE summaries
*/

router
  .route('/ch-summary/available/:book_id')
  .get(chapterSummaryController.availableSummaries);

router
  .route('/ch-summary/:book_id')
  .get(chapterSummaryController.bookChaptersSummary);

router
  .route('/ch-summary/:book_id/:chapter')
  .get(chapterSummaryController.getChapterSummary)
  .post(chapterSummaryController.createChapterSummary)
  .patch(chapterSummaryController.updateChapterSummary)
  .delete(chapterSummaryController.deleteChapterSummary);

module.exports = router;
