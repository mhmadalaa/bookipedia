const express = require('express');
const authController = require('./../controllers/authControllers');

const router = express();

router.route('/signup').post(authController.signup);
router.route('/confirm-signup/:confirmToken').post(authController.confirmSignup);

router.post('/forgot-password', authController.forgetPassword);
router.patch('/reset-password/:resetToken', authController.resetPassword);

router.post('/change-email', authController.isLogin, authController.changeEmail);
router.patch('/reset-email/:resetToken', authController.isLogin, authController.resetEmail);

// update the password for the logged in user, with submitting the current password
router.patch('/update-password', authController.isLogin, authController.updatePassword);

router.route('/login').post(authController.login);

router.route('/logout').post(authController.isLogin, authController.logout);

// update the non-crucial data of the user
router.route('/update-user').patch(authController.isLogin, authController.updateUser);

module.exports = router;