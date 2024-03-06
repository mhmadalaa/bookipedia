const express = require('express');
const bookController = require('../controllers/bookController');
const pdfService = require('../services/pdfService');

const router = express.Router();

router.get('/displayed-book/:id', bookController.displayBook);
router.get('/titles', bookController.getBooksTitles);

// router.get('/cover-images', bookController.getCoverImages);

router
  .route('/')
  .get(bookController.getAllBooks)
  .post(
    bookController.configMulter,
    pdfService.uploadFile,
    bookController.createBook,
    bookController.uploadCoverImage,
  );

router
  .route('/:id')
  .get(bookController.getCertainBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook, bookController.deleteCoverImage);

module.exports = router;
