const express = require('express');
const noteController = require('../controllers/noteController');
const authController = require('./../controllers/authControllers');
const router = express.Router();


router.use(authController.isLogin);

router.route('/')
  .post(noteController.createNote);


router.route('/:id')
  .patch(noteController.updateNoteContent)
  .delete(noteController.deleteNote);


module.exports = router;