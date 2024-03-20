// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { verifyDriver } = require('../Controller/Driver/verifyDriver');





const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Add Route
router.post('/verify/driver', verifyDriver);                                                                   // -----




module.exports = router;