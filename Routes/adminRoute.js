// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');





const { addOwner } = require('../Controller/Admin/Owner/addOwner');
const { getAllBusesWithDetails } = require('../Controller/Admin/Busses/getBusses');
const { deleteOwner,getOwner } = require('../Controller/Admin/Owner/deleteOwner');
const { updateOwner } = require('../Controller/Admin/Owner/updateOwner');
const { getAllReports } = require('../Controller/Admin/Reports and Feedback/getReports');
const { getAllFeedback } = require('../Controller/Admin/Reports and Feedback/getFeedbacks');





const { addAd,updateAd,deleteAd,incrementClickCount,getAdById } = require('../Controller/Admin/Ads/adsController');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')



router.post('/ads', upload.fields([{ name: 'pic' }, { name: 'video' }]),verifyTokenAdmin, addAd);
router.put('/ads', upload.fields([{ name: 'pic' }, { name: 'video' }]),verifyTokenAdmin, updateAd);
router.delete('/ads',verifyTokenAdmin,deleteAd);
router.post('/ads/count',verifyTokenUser, incrementClickCount);
router.get('/ads',verifyTokenAdmin, getAdById);


//Owner
router.post('/add/owner',verifyTokenAdmin, addOwner);                                                                       // -----
router.delete('/delete/owner',verifyTokenAdmin, deleteOwner);                                                                    // -----
router.put('/update/owner',verifyTokenAdmin, updateOwner);                                                                    // -----
router.get('/get/owner',verifyTokenAdmin, getOwner);   




// -----
router.get('/get/busses',verifyTokenAdmin, getAllBusesWithDetails);                                                                    // -----




router.get('/reports',verifyTokenAdmin, getAllReports);                                                                  // -----working
router.get('/feedbacks',verifyTokenAdmin, getAllFeedback);                                                               // -----working



module.exports = router;