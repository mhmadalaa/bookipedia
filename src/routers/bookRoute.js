const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('./../controllers/authControllers');
const pdfService = require('../services/pdfService');

const router = express.Router();

router.get(
  '/displayed-book/:id',
  authController.isLogin,
  bookController.displayBook,
);

router.get('/titles', authController.isLogin, bookController.getBooksTitles);

// router.get('/cover-images', bookController.getCoverImages);

// note: admin authentication is added but disabled for development
//       process to make it easy to test the other routes

router.route('/').get(authController.isLogin, bookController.getAllBooks).post(
  authController.isLogin,
  // authController.isAdmin,
  bookController.configMulter,
  pdfService.uploadFile,
  bookController.createBook,
  bookController.uploadCoverImage,
);

router
  .route('/:id')
  .get(authController.isLogin, bookController.getCertainBook)
  .patch(
    authController.isLogin,
    // authController.isAdmin,
    bookController.updateBook,
  )
  .delete(
    authController.isLogin,
    // authController.isAdmin,
    bookController.deleteBook,
    bookController.deleteCoverImage,
  );

router
  .route('/:id/user')
  .put(authController.isLogin, bookController.addUserBook)
  .delete(authController.isLogin, bookController.removeUserBook);

module.exports = router;
