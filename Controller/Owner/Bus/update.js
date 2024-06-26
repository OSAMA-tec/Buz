const { Bus } = require('../../../Model/Bus');
const { Route } = require('../../../Model/route');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');

const updateBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to update buses' });
    }

    const {
      busId,
      name,
      number,
      type,
      capacity,
      latitude,
      longitude,
      busType,
      origin,
      originlon,
      originlat,
      destination,
      destinationlon,
      destinationlat,
      distance,
      estimatedTravelTime,
      waypoints
    } = req.body;

    // Validate required fields
    if (!busId) {
      return res.status(400).json({ error: 'Bus ID is required' });
    }
    console.log(req.body)
    // Parse the amenities object from the form data
    let amenities = {};
    if (req.body.amenities) {
      try {
        amenities = JSON.parse(req.body.amenities);
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return res.status(400).json({ error: 'Invalid amenities format' });
      }
    }

    // Parse the stops array from the form data
    const stops = req.body.stops ? JSON.parse(req.body.stops) : [];
    const stopslon = req.body.stopslon ? JSON.parse(req.body.stopslon) : [];
    const stopslat = req.body.stopslat ? JSON.parse(req.body.stopslat) : [];
    console.log(stops)

    // Validate stops array lengths
    if (stops.length !== stopslon.length || stops.length !== stopslat.length) {
      return res.status(400).json({ error: 'Stops arrays must have the same length' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const routeId = bus.routeId;

    if (name) bus.name = name;
    if (number) bus.number = number;
    if (type) bus.type = type;
    if (capacity !== undefined) bus.capacity = capacity;
    if (latitude) bus.latitude = latitude;
    if (longitude) bus.longitude = longitude;
    if (busType) bus.busType = busType;
    if (origin) bus.origin = origin;
    if (originlon !== undefined) bus.originlon = originlon;
    if (originlat !== undefined) bus.originlat = originlat;
    if (destination) bus.destination = destination;
    if (destinationlon !== undefined) bus.destinationlon = destinationlon;
    if (destinationlat !== undefined) bus.destinationlat = destinationlat;
    if (distance !== undefined) bus.distance = distance;
    if (waypoints) bus.waypoints = waypoints;

    // Convert estimatedTravelTime to a number
    if (estimatedTravelTime !== undefined) {
      const parsedEstimatedTravelTime = parseInt(estimatedTravelTime, 10);
      if (isNaN(parsedEstimatedTravelTime)) {
        return res.status(400).json({ error: 'Invalid estimatedTravelTime value' });
      }
      bus.estimatedTravelTime = parsedEstimatedTravelTime;
    }

    bus.amenities = amenities;

    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;

      try {
        const logoUrl = await uploadImageToFirebase(base64Image, contentType);
        bus.logoUrl = logoUrl;
      } catch (error) {
        console.error('Error uploading bus logo:', error);
        return res.status(500).json({ error: 'Failed to upload bus logo' });
      }
    }

    // Update the route if stops are provided and routeId exists
    if (stops && Array.isArray(stops) && stops.length > 0 && routeId) {
      const route = await Route.findById(routeId);
      if (!route) {
        return res.status(404).json({ error: 'Route not found' });
      }

      route.stops = stops.map((stop, index) => ({
        name: stop,
        longitude: stopslon[index],
        latitude: stopslat[index],
      }));

      try {
        await route.save();
      } catch (error) {
        console.error('Error updating route:', error);
        return res.status(500).json({ error: 'Failed to update route' });
      }
    }

    try {
      const updatedBus = await bus.save();
      res.status(200).json(updatedBus);
    } catch (error) {
      console.error('Error updating bus:', error);
      res.status(500).json({ error: 'Failed to update bus' });
    }
  } catch (error) {
    console.error('Error updating bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = { updateBus };
