const express = require('express');
const booksController = require('./../controllers/booksController');

const router = express.Router();


router.post('/upload', booksController.uploadSingleFile, booksController.uploadBook);
router.get('/uploadedbooks/:id', booksController.displayBook);
router.get('/books', booksController.getBooks);
router.get('/booksTitles', booksController.getBooksTitles);
router.route('/books/:id').get(booksController.getCertainBook).delete(booksController.deleteBook);


module.exports = router;