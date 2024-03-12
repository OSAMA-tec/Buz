// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { createRoute,getAllRoutes } = require('../Controller/Admin/Route/addRoute');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//Add Route
router.post('/route',verifyTokenAdmin, createRoute);                                                                   // -----
router.get('/route',verifyTokenAdmin, getAllRoutes);                                                                  // -----



module.exports = router;