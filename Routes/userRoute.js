// userRoutes.js
const express = require('express');
const router = express.Router();



const { signup, signin } = require('../Controller/User/Registration');
const { forgotPassword, updatePassword,verifyOTP } = require('../Controller/User/forgetPassword');



const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//Registration------User
router.post('/signup', signup);                                      // ----Working
router.post('/signin', signin);                                      // ----Working
router.post('/forgot/password', forgotPassword);                     // ----Working
router.post('/verify/otp', verifyOTP);                               // ----Working
router.post('/update/password', updatePassword);                     // ----Working


module.exports = router;