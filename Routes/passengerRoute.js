// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { getAllBuses } = require('../Controller/Passenger/getBuses');
const { getBusesByRoute } = require('../Controller/Passenger/getBusesTrip');
const { submitReport,updateReport } = require('../Controller/Passenger/busReport');
const { createFeedback,getFeedbackByBus } = require('../Controller/Passenger/busFeedback');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Get Route
router.get('/buses', getAllBuses);                                                                                        // -----
router.get('/trip/buses',verifyTokenUser, getBusesByRoute);                                                               // -----working
router.post('/report/bus',verifyTokenUser, submitReport);                                                                 // -----working
router.post('/report/update',verifyTokenUser, updateReport);                                                              // -----working
router.post('/feedback/submit',verifyTokenUser, createFeedback);                                                          // -----working
router.get('/feedback',verifyTokenUser, getFeedbackByBus);                                                                // -----working




module.exports = router;