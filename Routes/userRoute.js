// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { signup, signin } = require('../Controller/User/Registration');
const { forgotPassword, updatePassword,verifyOTP } = require('../Controller/User/forgetPassword');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//Registration------User
router.post('/signup', signup);                                      // ----Working
router.post('/signin', signin);                                      // ----Working
//Password------User
router.post('/forgot/password', forgotPassword);                     // ----Working
router.post('/verify/otp', verifyOTP);                               // ----Working
router.post('/update/password', updatePassword);                     // ----Working
//Profile------User
router.post('/profile',verifyTokenUser,  upload.single('profilePicture'),updatePassword);                     // ----


module.exports = router;