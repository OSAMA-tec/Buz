// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');



const { createRoute,getAllRoutes } = require('../Controller/Admin/Route/addRoute');
const { updateRoute } = require('../Controller/Admin/Route/update');
const { deleteRoute } = require('../Controller/Admin/Route/deleteRoute');


const { addBus } = require('../Controller/Admin/Bus/addBus');
const { updateBus } = require('../Controller/Admin/Bus/update');
const { deleteBus } = require('../Controller/Admin/Bus/deleteBus');



const { addOwner } = require('../Controller/Admin/Owner/addOwner');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



//   Add Route
router.post('/route',verifyTokenAdmin, createRoute);                                                                   // -----Working
router.get('/route',verifyTokenAdmin, getAllRoutes);                                                                   // -----Working
router.put('/route',verifyTokenAdmin, updateRoute);                                                                    // -----
router.put('/route',verifyTokenAdmin, deleteRoute);                                                                    // -----


//   Add Bus
router.post('/bus',verifyTokenAdmin,upload.single('Logo'), addBus);                                                    // -----working
router.put('/bus',verifyTokenAdmin,upload.single('Logo'), updateBus);                                                  // -----
router.delete('/bus',verifyTokenAdmin,upload.single('Logo'), deleteBus);                                               // -----

//Owner
router.post('/add/owner',verifyTokenAdmin, addOwner);                                                               // -----



module.exports = router;