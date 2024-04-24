const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNo: { type: String, required: true },
    role: { type: String, enum: ['user', 'driver', 'admin','owner'], required: true },
    contactDetails: { type: String },
    otp: { type: String },
    otpVerified: { type: Boolean,default:true },
    profileUrl: { type: String },
    otpPurpose: { type: String, enum: ['signup', 'forgotPassword'], default: 'signup' },

});


const User = mongoose.model('User', userSchema);
module.exports = { User }
