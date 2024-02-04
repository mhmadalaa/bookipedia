const express  = require('express');
const booksController = require('./../controllers/booksController');


const router = express.Router();

router.route('/').get(booksController.getAllBooks).post(booksController.createBook);
router.route('/:id').get(booksController.getCertainBook).patch(booksController.updateBook).delete(booksController.deleteBook);

module.exports = router;