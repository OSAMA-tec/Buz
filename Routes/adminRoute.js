// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');





const { addOwner } = require('../Controller/Admin/Owner/addOwner');
const { deleteOwner,getOwner } = require('../Controller/Admin/Owner/deleteOwner');
const { updateOwner } = require('../Controller/Admin/Owner/updateOwner');
const { getAllReports } = require('../Controller/Admin/Reports and Feedback/getReports');
const { getAllFeedback } = require('../Controller/Admin/Reports and Feedback/getFeedbacks');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')





//Owner
router.post('/add/owner',verifyTokenAdmin, addOwner);                                                                       // -----
router.delete('/delete/owner',verifyTokenAdmin, deleteOwner);                                                                    // -----
router.put('/update/owner',verifyTokenAdmin, updateOwner);                                                                    // -----
router.get('/get/owner',verifyTokenAdmin, getOwner);                                                                    // -----




router.get('/reports',verifyTokenAdmin, getAllReports);                                                                  // -----working
router.get('/feedbacks',verifyTokenAdmin, getAllFeedback);                                                               // -----working



module.exports = router;