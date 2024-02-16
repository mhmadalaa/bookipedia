const express  = require('express');
const booksController = require('./../controllers/booksController');
const fileController = require('./../controllers/filesController');


const router = express.Router();

router.get('/displayed-book/:id' ,booksController.displayBook);
/* router.get('/DisplayImage/:id' ,booksController.getOneImage);
 */router.get('/titles' ,booksController.getBooksTitles);
router.get('/cover-images' ,booksController.getCoverImages);


router.route('/')
  .get(booksController.getAllBooks)
  .post(fileController.uploadFilesByMulter,
    fileController.uploadImage,
    fileController.uploadFile,
    booksController.createBook);
router.route('/:id')
  .get(booksController.getCertainBook)
  .patch(booksController.updateBook)
  .delete(booksController.deleteBook);


module.exports = router;