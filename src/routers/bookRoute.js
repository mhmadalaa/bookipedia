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

// TODO: admin auth

router
  .route('/')
  .get(authController.isLogin, bookController.getAllBooks)
  .post(
    bookController.configMulter,
    pdfService.uploadFile,
    bookController.uploadCoverImage,
    bookController.createBook,
  );

router
  .route('/:id')
  .get(authController.isLogin, bookController.getCertainBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

router
  .route('/:id/user')
  .put(authController.isLogin, bookController.addUserBook)
  .delete(authController.isLogin, bookController.removeUserBook);

module.exports = router;
