// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { getAllBuses } = require('../Controller/Passenger/getBuses');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Get Route
router.get('/bus', getAllBuses);                                                                   // -----




module.exports = router;