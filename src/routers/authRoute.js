const authController = require('../controllers/authControllers');
const express = require('express');

const router = express.Router();

router.post('/signup' ,authController.signup);
router.post('/confirm-your-account' , authController.confirmSignup);
router.post('/resend-verification-email' ,authController.resendOtp);
router.post('/login' , authController.login);


router.post('/forget-password' , authController.forgetPassword);
router.patch('/reset-password' , authController.resetPassword);

router.use(authController.isLogin);
router.get('/change-email' , authController.changeEmail);
router.patch('/reset-email' ,authController.resetEmail);

router.patch('/update-user-data' ,authController.updateUser);

router.patch('/update-password' ,authController.updatePassword);


module.exports = router;