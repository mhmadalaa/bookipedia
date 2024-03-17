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
    bookController.uploadCoverImage,
    bookController.createBook,
  );

router
  .route('/:id')
  .get(bookController.getCertainBook)
  .patch(bookController.updateBook)
  .delete(bookController.deleteBook);

module.exports = router;
