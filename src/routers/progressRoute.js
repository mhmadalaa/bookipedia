const express = require('express');
const progressController = require('../controllers/progressController');
const authController = require('./../controllers/authControllers');
const router = express.Router();

router.use(authController.isLogin);

router
  .route('/:id')
  .patch(
    progressController.enforceQueryParams,
    progressController.updateProgress,
  );

module.exports = router;
