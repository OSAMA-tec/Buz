const mongoose = require('mongoose')
const reportSchema = new mongoose.Schema({
    passengerId: { type: String},
    busId: { type: String },
    routeId: { type: String },
    issueType: { type: String},
    description: { type: String },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    driverId:{type:String},
  });

  const Report = mongoose.model('Report', reportSchema);

module.exports={Report}