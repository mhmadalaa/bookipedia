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

// note: add and remove admin functionality is intuitive
//       what it do is just if you are an admin? you can add another admin
//       or remove an existing admin
//       without applying any conditions for somethings like hierarchical roles
router
  .route('/remove')
  .delete(
    authController.isLogin,
    authController.isAdmin,
    adminController.removeAdmin,
  );

module.exports = router;
