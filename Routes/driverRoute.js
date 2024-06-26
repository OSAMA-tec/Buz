// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { verifyDriver } = require('../Controller/Driver/verifyDriver');
const { submitReport,updateReport } = require('../Controller/Driver/reportDriver');
const { busStatusUpdate } = require('../Controller/Driver/busStatus');





const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Add Route
router.post('/verify', verifyDriver);                                                                          // -----working
router.post('/report/submit', submitReport);                                                                   // -----working
router.post('/report/update', updateReport);                                                                   // -----working
router.post('/bus/status', busStatusUpdate);                                                                   // -----working




module.exports = router;