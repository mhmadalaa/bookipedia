const express = require('express');
const questionController = require('../controllers/questionController');
const textToSpeechController = require('../controllers/textToSpeechController');
const chapterSummaryController = require('../controllers/chSummaryController');
const authController = require('./../controllers/authControllers');

const router = express.Router();

// in question and chat there will be query strnig in req `?type=book` or `?type=document`
router
  .route('/question/:id')
  .get(
    authController.isLogin,
    questionController.enforceQueryParams,
    questionController.askQuestion,
  );

router
  .route('/chat/:id')
  .get(
    authController.isLogin,
    questionController.enforceQueryParams,
    questionController.reteriveChat,
  );

router
  .route('/tts')
  .get(authController.isLogin, textToSpeechController.textToSpeech);

/*
TODO: 
  1. specifiy the role of users who can POST, UPDATE, DELETE summaries
*/

router
  .route('/ch-summary/available/:book_id')
  .get(
    authController.isLogin,
    chapterSummaryController.isBookAvilable,
    chapterSummaryController.availableSummaries,
  );

router
  .route('/ch-summary/:book_id')
  .get(
    authController.isLogin,
    chapterSummaryController.isBookAvilable,
    chapterSummaryController.bookChaptersSummary,
  );

// router.use(chapterSummaryController.checkAvailability);

router
  .route('/ch-summary/:book_id/:chapter')
  .get(
    authController.isLogin,
    chapterSummaryController.checkAvailability,
    chapterSummaryController.getChapterSummary,
  )
  // TODO: the upcoming three function need an admin role for authentication
  .post(
    chapterSummaryController.checkAvailability,
    chapterSummaryController.createChapterSummary,
  )
  .patch(
    chapterSummaryController.checkAvailability,
    chapterSummaryController.updateChapterSummary,
  )
  .delete(
    chapterSummaryController.checkAvailability,
    chapterSummaryController.deleteChapterSummary,
  );

module.exports = router;
