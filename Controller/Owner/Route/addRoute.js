const { Route } = require('../../../Model/route');
const { OwnerBus } = require('../../../Model/Owner');

const createRoute = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to create routes' });
    }

    const { 
      origin, originlon, originlat, 
      destination, destinationlon, destinationlat, 
      stops, stopslon, stopslat, 
      distance, estimatedTravelTime, waypoints 
    } = req.body;

    if (!origin || !originlon || !originlat || !destination || !destinationlon || !destinationlat) {
      return res.status(400).json({ error: 'Origin and destination with their coordinates are required' });
    }

    if (stops && (stops.length !== stopslon.length || stops.length !== stopslat.length)) {
      return res.status(400).json({ error: 'Stops and their coordinates must have the same length' });
    }

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const newRoute = new Route({
      origin: { name: origin, longitude: originlon, latitude: originlat },
      destination: { name: destination, longitude: destinationlon, latitude: destinationlat },
      stops: stops.map((stop, index) => ({
        name: stop,
        longitude: stopslon[index],
        latitude: stopslat[index]
      })),
      distance,
      estimatedTravelTime,
      waypoints,
      ownerId: ownerBus._id,
    });

    const savedRoute = await newRoute.save();

    res.status(201).json(savedRoute);
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};




const getAllRoutes = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to access this resource' });
    }

    const userId = req.user._id;

    const owner = await OwnerBus.findOne({ userId });

    if (!owner) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const ownerId = owner._id;

    const routes = await Route.find({ ownerId });

    res.status(200).json(routes);
  } catch (error) {
    console.error('Error getting routes:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
module.exports = { createRoute, getAllRoutes };