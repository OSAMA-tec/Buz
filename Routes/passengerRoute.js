// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { getAllBuses } = require('../Controller/Passenger/getBuses');
const { getBusesByRoute } = require('../Controller/Passenger/getBusesTrip');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Get Route
router.get('/bus', getAllBuses);                                                                                          // -----
router.get('/trip/buses',verifyTokenUser, getBusesByRoute);                                                               // -----working




module.exports = router;