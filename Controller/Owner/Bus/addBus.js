const { Route } = require('../../../Model/route');
const { Bus } = require('../../../Model/Bus');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const addBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para añadir autobuses.' });
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
        amenities = req.body.amenities;
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return res.status(400).json({ error: 'Formato de amenities no válido.' });
      }
    }

    // Parse the stops array from the form data
    const stops = req.body.stops ? JSON.parse(req.body.stops) : [];
    const stopslon = req.body.stopslon ? JSON.parse(req.body.stopslon) : [];
    const stopslat = req.body.stopslat ? JSON.parse(req.body.stopslat) : [];

    if (!name) {
      return res.status(400).json({ error: 'Se requiere el nombre' });
    }

    if (!number) {
      return res.status(400).json({ error: 'Se requiere el número' });
    }

    if (!type) {
      return res.status(400).json({ error: 'Se requiere el tipo' });
    }

    if (capacity === undefined) {
      return res.status(400).json({ error: 'Se requiere la capacidad' });
    }

    if (!latitude) {
      return res.status(400).json({ error: 'Se requiere la latitud' });
    }

    if (!longitude) {
      return res.status(400).json({ error: 'Se requiere la longitud' });
    }

    if (!busType) {
      return res.status(400).json({ error: 'Se requiere el tipo de autobús' });
    }

    if (!origin) {
      return res.status(400).json({ error: 'Se requiere el origen' });
    }

    if (originlon === undefined) {
      return res.status(400).json({ error: 'Se requiere la longitud de origen' });
    }

    if (originlat === undefined) {
      return res.status(400).json({ error: 'Se requiere la latitud de origen' });
    }

    if (!destination) {
      return res.status(400).json({ error: 'Se requiere el destino' });
    }

    if (destinationlon === undefined) {
      return res.status(400).json({ error: 'Se requiere la longitud de destino' });
    }

    if (destinationlat === undefined) {
      return res.status(400).json({ error: 'Se requiere la latitud de destino' });
    }


    // Convert estimatedTravelTime to a number
    const parsedEstimatedTravelTime = parseInt(estimatedTravelTime, 10);
    if (isNaN(parsedEstimatedTravelTime)) {
      return res.status(400).json({ error: 'Valor de estimatedTravelTime no válido.' });
    }

    const existingBus = await Bus.findOne({ number });
    if (existingBus) {
      return res.status(400).json({ error: 'El número de autobús ya existe' });
    }

    let logoUrl = '';
    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;
      try {
        logoUrl = await uploadImageToFirebase(base64Image, contentType);
      } catch (error) {
        console.error('Error al subir el logo del autobús', error);
        return res.status(500).json({ error: 'Error al subir el logo del autobús.' });
      }
    }

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Propietario no encontrado.' });
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
    console.error('Error al añadir el autobús', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};


const getAllBusesByOwner = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para acceder a este recurso' });
    }

    const userId = req.user._id;

    const owner = await OwnerBus.findOne({ userId });

    if (!owner) {
      return res.status(404).json({ error: 'Propietario no encontrado' });
    }

    const ownerId = owner._id;

    const buses = await Bus.find({ ownerId });

    const busesWithDetails = await Promise.all(buses.map(async (bus) => {
      const location = await Location.findOne({ busId: bus._id });

      // Validate routeId before querying
      let route = null;
      if (ObjectId.isValid(bus.routeId)) {
        route = await Route.findById(bus.routeId);
      }

      return {
        ...bus._doc,
        route,
        location
      };
    }));

    const totalBusesCount = buses.length;
    const totalStoppedBusesCount = buses.filter(bus => !bus.driverId).length;
    const totalRunningBusesCount = totalBusesCount - totalStoppedBusesCount;

    res.status(200).json({
      buses: busesWithDetails,
      totalBusesCount,
      totalStoppedBusesCount,
      totalRunningBusesCount
    });
  } catch (error) {
    console.error('Error al obtener los autobuses', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};






module.exports = { addBus, getAllBusesByOwner };