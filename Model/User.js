const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    role: { type: String, enum: ['user', 'driver', 'admin'], required: true },
    contactDetails: { type: String },
    otp: { type: String },
    otpVerified: { type: Boolean,default:true }

});


const User = mongoose.model('User', userSchema);
module.exports = { User }
