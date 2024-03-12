// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { createRoute,getAllRoutes } = require('../Controller/Admin/Route/addRoute');
const { addBus } = require('../Controller/Admin/Bus/addBus');
const { updateBus } = require('../Controller/Admin/Bus/update');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Add Route
router.post('/route',verifyTokenAdmin, createRoute);                                                                   // -----Working
router.get('/route',verifyTokenAdmin, getAllRoutes);                                                                   // -----Working


//   Add Bus
router.post('/bus',verifyTokenAdmin,upload.single('Logo'), addBus);                                                      // -----working
router.put('/bus',verifyTokenAdmin,upload.single('Logo'), updateBus);                                                    // -----working



module.exports = router;