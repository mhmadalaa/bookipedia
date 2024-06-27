const express = require('express');
const progressController = require('../controllers/progressController');
const authController = require('./../controllers/authControllers');
const router = express.Router();

router.use(authController.isLogin);

router
  .route('/recommendation-books')
  .get(progressController.recommendationBooks);

router.route('/recent-reading').get(progressController.recentReadingActivitiy);

router
  .route('/:id')
  .patch(
    progressController.enforceQueryParams,
    progressController.updateProgress,
  );

module.exports = router;
