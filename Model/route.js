const mongoose = require('mongoose');

const locationRouteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  longitude: { type: String, required: true },
  latitude: { type: String, required: true }
});

const routeSchema = new mongoose.Schema({
  origin: { type: locationRouteSchema, required: true },
  destination: { type: locationRouteSchema, required: true },
  stops: [{ type: locationRouteSchema }],
  distance: { type: Number },
  estimatedTravelTime: { type: Number },
  waypoints: [{ type: String }],
  ownerId: { type: String }
});

const Route = mongoose.model('Route', routeSchema);
module.exports = { Route };
