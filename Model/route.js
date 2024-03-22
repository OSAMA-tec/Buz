const mongoose = require('mongoose')

const routeSchema = new mongoose.Schema({
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    stops: [{ type: String }],
    distance: { type: Number },
    estimatedTravelTime: { type: Number },
    waypoints: [{ type: String }],
    ownerId: { type: String },
  });
  const Route = mongoose.model('Route', routeSchema);
module.exports={Route}