// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');





const { addOwner } = require('../Controller/Admin/Owner/addOwner');
const { getAllReports } = require('../Controller/Admin/Reports and Feedback/getReports');
const { getAllFeedback } = require('../Controller/Admin/Reports and Feedback/getFeedbacks');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')





//Owner
router.post('/add/owner',verifyTokenAdmin, addOwner);                                                                    // -----
router.get('/reports',verifyTokenAdmin, getAllReports);                                                                  // -----working
router.get('/feedbacks',verifyTokenAdmin, getAllFeedback);                                                               // -----working



module.exports = router;