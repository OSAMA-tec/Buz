const { Route } = require('../../../Model/route');

const updateRoute = async (req, res) => {
  try {
    // Check if the user has the 'owner' role
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para actualizar rutas.' });
    }

    const { 
      routeId, 
      origin, originlon, originlat, 
      destination, destinationlon, destinationlat, 
      stops, stopslon, stopslat, 
      distance, estimatedTravelTime, waypoints 
    } = req.body;

    if (!routeId) {
      return res.status(400).json({ error: 'Se requiere el ID de la ruta.' });
    }

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ error: 'Ruta no encontrada.' });
    }

    if (origin && originlon && originlat) {
      route.origin = { name: origin, longitude: originlon, latitude: originlat };
    }
    if (destination && destinationlon && destinationlat) {
      route.destination = { name: destination, longitude: destinationlon, latitude: destinationlat };
    }
    if (stops && stopslon && stopslat) {
      if (stops.length !== stopslon.length || stops.length !== stopslat.length) {
        return res.status(400).json({ error: 'Las paradas y sus coordenadas deben tener la misma longitud.' });
      }
      route.stops = stops.map((stop, index) => ({
        name: stop,
        longitude: stopslon[index],
        latitude: stopslat[index]
      }));
    }
    if (distance !== undefined) route.distance = distance;
    if (estimatedTravelTime !== undefined) route.estimatedTravelTime = estimatedTravelTime;
    if (waypoints !== undefined) route.waypoints = waypoints;

    // Save the updated route
    const updatedRoute = await route.save();

    // Respond with the updated route
    res.status(200).json(updatedRoute);
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { updateRoute };
