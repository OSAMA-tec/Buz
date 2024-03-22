const { Route } = require('../../../Model/route');

const updateRoute = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to update routes' });
    }

    const { routeId, origin, destination, stops, distance, estimatedTravelTime, waypoints } = req.body;

    // Find the route by ID
    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Route not found' });
    }

    // Update the route fields
    if (origin) route.origin = origin;
    if (destination) route.destination = destination;
    if (stops) route.stops = stops;
    if (distance) route.distance = distance;
    if (estimatedTravelTime) route.estimatedTravelTime = estimatedTravelTime;
    if (waypoints) route.waypoints = waypoints;

    // Save the updated route
    const updatedRoute = await route.save();

    res.status(200).json(updatedRoute);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateRoute };