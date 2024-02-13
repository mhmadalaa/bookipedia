const express  = require('express');
const booksController = require('./../controllers/booksController');
const fileController = require('./../controllers/filesController');


const router = express.Router();

router.get('/DisplayBook/:id' ,booksController.displayBook);
router.get('/titles' ,booksController.getBooksTitles);


router.route('/')
  .get(booksController.getAllBooks)
  .post(fileController.uploadSingleFile,fileController.uploadFile,booksController.createBook);
router.route('/:id')
  .get(booksController.getCertainBook)
  .patch(booksController.updateBook)
  .delete(booksController.deleteBook);


module.exports = router;