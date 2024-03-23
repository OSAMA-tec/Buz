const mongoose = require('mongoose')
const feedbackSchema = new mongoose.Schema({
    passengerId: { type: String},
    routeId: { type: String },
    Anyissue: { type: String},
    description: { type: String },
    recommendations: { type: String },
    timestamp: { type: Date, default: Date.now },
    service: { type: String, enum: ['good', 'excelent','normal'], default: 'normal' },
    driverId:{type:String},
  });

  const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports={Feedback}