const express = require('express');
const booksController = require('./../controllers/booksController');
const pdfService = require('./../services/pdfService');

const router = express.Router();

router.get('/displayed-book/:id', booksController.displayBook);
router.get('/titles', booksController.getBooksTitles);

// router.get('/cover-images', booksController.getCoverImages);

router
  .route('/')
  .get(booksController.getAllBooks)
  .post(
    booksController.configMulter,
    pdfService.uploadFile,
    booksController.createBook,
    booksController.handleCoverImage,
  );

router
  .route('/:id')
  .get(booksController.getCertainBook)
  .patch(booksController.updateBook)
  .delete(booksController.deleteBook);

module.exports = router;
