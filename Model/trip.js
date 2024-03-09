const mongoose = require('mongoose')

const tripSchema = new mongoose.Schema({
    passengerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    selectedRoute: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    estimatedTravelTime: { type: Number },
    status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' },
  });
  const Trip = mongoose.model('Trip', tripSchema);
  module.exports={Trip}