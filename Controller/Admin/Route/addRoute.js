const { Route } = require('../../../Model/route');

const createRoute = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'You are not authorized to create routes' });
    }

    const { origin, destination, stops, distance, estimatedTravelTime, waypoints } = req.body;

    const newRoute = new Route({
      origin,
      destination,
      stops,
      distance,
      estimatedTravelTime,
      waypoints,
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
      const routes = await Route.find();
  
      res.status(200).json(routes);
    } catch (error) {
      console.error('Error getting routes:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
module.exports = { createRoute,getAllRoutes };