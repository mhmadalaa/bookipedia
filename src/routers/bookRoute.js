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

router.get(
  '/cover-images',
  authController.isLogin,
  bookController.getCoverImages,
);

router.get('/titles', authController.isLogin, bookController.getBooksTitles);

router.route('/user').get(authController.isLogin, bookController.getUserBooks);

router
  .route('/:id/user')
  .put(authController.isLogin, bookController.addUserBook)
  .delete(authController.isLogin, bookController.removeUserBook);

router.route('/').get(authController.isLogin, bookController.getAllBooks).post(
  authController.isLogin,
  // authController.isAdmin,
  bookController.configMulter,
  pdfService.uploadFile,
  bookController.uploadCoverImage,
  bookController.createBook,
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
  );

module.exports = router;
