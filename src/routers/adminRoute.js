const express = require('express');
const authController = require('./../controllers/authControllers');
const adminController = require('./../controllers/adminController');

const router = express.Router();

router
  .route('/add')
  .post(
    authController.isLogin,
    authController.isAdmin,
    adminController.addAdmin,
  );
  
// you are his hierarchical admin?
router
  .route('/remove')
  .delete(
    authController.isLogin,
    authController.isAdmin,
    adminController.removeAdmin,
  );

module.exports = router;
