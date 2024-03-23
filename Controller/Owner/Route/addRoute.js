const { Route } = require('../../../Model/route');
const { OwnerBus } = require('../../../Model/Owner');

const createRoute = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to create routes' });
    }

    const { origin, destination, stops, distance, estimatedTravelTime, waypoints } = req.body;

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    const newRoute = new Route({
      origin,
      destination,
      stops,
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