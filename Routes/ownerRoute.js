// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { createRoute,getAllRoutes } = require('../Controller/Owner/Route/addRoute');
const { updateRoute } = require('../Controller/Owner/Route/update');
const { deleteRoute } = require('../Controller/Owner/Route/deleteRoute');


const { addBus,getAllBusesByOwner } = require('../Controller/Owner/Bus/addBus');
const { updateBus } = require('../Controller/Owner/Bus/update');
const { deleteBus } = require('../Controller/Owner/Bus/deleteBus');






const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver,BusOwner } = require('../Middleware/jwt')



//   Add Route
router.post('/route',BusOwner, createRoute);                                                                   // -----Working
router.get('/route',BusOwner, getAllRoutes);                                                                   // -----Working
router.put('/route',BusOwner, updateRoute);                                                                    // -----
router.put('/route',BusOwner, deleteRoute);                                                                    // -----


//   Add Bus
router.post('/bus',BusOwner,upload.single('Logo'), addBus);                                                    // -----working
router.put('/bus',BusOwner,upload.single('Logo'), updateBus);                                                  // -----
router.delete('/bus',BusOwner,upload.single('Logo'), deleteBus);                                               // -----
router.get('/bus',BusOwner, getAllBusesByOwner);                                               // -----




module.exports = router;