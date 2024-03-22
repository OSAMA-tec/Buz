// userRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');





const { addOwner } = require('../Controller/Admin/Owner/addOwner');




const upload = multer({ storage: multer.memoryStorage() });
const { verifyTokenAdmin, verifyTokenUser, verifyTokenDriver } = require('../Middleware/jwt')





//Owner
router.post('/add/owner',verifyTokenAdmin, addOwner);                                                               // -----



module.exports = router;