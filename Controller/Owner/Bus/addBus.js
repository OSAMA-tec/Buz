const { Route } = require('../../../Model/route');
const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');

const addBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'You are not authorized to add buses' });
    }

    const {
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

    if (!name || !number || !type || capacity === undefined || !latitude || !longitude || !busType ||
      !origin || originlon === undefined || originlat === undefined || !destination || destinationlon === undefined || destinationlat === undefined) {
      return res.status(400).json({ error: 'Required fields are missing' });
    }

    // Convert estimatedTravelTime to a number
    const parsedEstimatedTravelTime = parseInt(estimatedTravelTime, 10);
    if (isNaN(parsedEstimatedTravelTime)) {
      return res.status(400).json({ error: 'Invalid estimatedTravelTime value' });
    }

    const existingBus = await Bus.findOne({ number });
    if (existingBus) {
      return res.status(400).json({ error: 'Bus number already exists' });
    }

    let logoUrl = '';
    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;
      try {
        logoUrl = await uploadImageToFirebase(base64Image, contentType);
      } catch (error) {
        console.error('Error uploading bus logo:', error);
        return res.status(500).json({ error: 'Failed to upload bus logo' });
      }
    }

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Owner not found' });
    }

    // Check if stops are provided
    let routeData = null;
    if (stops && Array.isArray(stops) && stops.length > 0) {
      // Create and save the route
      const newRoute = new Route({
        origin: { name: origin, longitude: originlon, latitude: originlat },
        destination: { name: destination, longitude: destinationlon, latitude: destinationlat },
        stops: stops.map((stop, index) => ({
          name: stop,
          longitude: stopslon[index],
          latitude: stopslat[index]
        })),
        distance,
        estimatedTravelTime: parsedEstimatedTravelTime,
        waypoints,
        ownerId: ownerBus._id,
      });

      routeData = await newRoute.save();
    }

    const newBus = new Bus({
      name,
      number,
      logoUrl,
      type,
      capacity,
      amenities,
      seatsAvailable: capacity,
      routeId: routeData ? routeData._id : null,
      ownerId: ownerBus._id,
      busType,
    });

    const savedBus = await newBus.save();

    const newLocation = new Location({
      busId: savedBus._id,
      latitude,
      longitude,
    });

    await newLocation.save();

    res.status(201).json(savedBus);
  } catch (error) {
    console.error('Error adding bus:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllBusesByOwner = async (req, res) => {
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

    const buses = await Bus.find({ ownerId });

    const busesWithDetails = await Promise.all(buses.map(async (bus) => {
      const location = await Location.findOne({ busId: bus._id });
      const route = await Route.findById(bus.routeId);

      return {
        ...bus._doc,
        route,
        location
      };
    }));

    res.status(200).json(busesWithDetails);
  } catch (error) {
    console.error('Error getting buses:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





module.exports = { addBus,getAllBusesByOwner };