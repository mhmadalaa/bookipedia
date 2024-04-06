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

router.get('/cover-images' ,bookController.getCoverImages);

router.get('/titles', bookController.getBooksTitles);


router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    authController.isLogin,
    bookController.configMulter,
    pdfService.uploadFile,
    bookController.uploadCoverImage,
    bookController.createBook,
  );

router
  .route('/:id')
  .get(bookController.getCertainBook)
  .patch(authController.isLogin,bookController.updateBook)
  .delete(authController.isLogin,bookController.deleteBook);


router
  .route('/:id/user')
  .put(authController.isLogin, bookController.addUserBook)
  .delete(authController.isLogin, bookController.removeUserBook);

module.exports = router;
