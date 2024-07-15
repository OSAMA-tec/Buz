const { Bus } = require('../../../Model/Bus');
const { Route } = require('../../../Model/route');
const { Location } = require('../../../Model/location');
const { OwnerBus } = require('../../../Model/Owner');
const { uploadImageToFirebase } = require('../../../Firebase/uploadImage');
const mongoose = require('mongoose');
const { ObjectId } = mongoose.Types;

const updateBus = async (req, res) => {
  try {
    if (req.user.role !== 'owner') {
      return res.status(403).json({ error: 'No estás autorizado para actualizar autobuses.' });
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
    console.log(req.body)
    let amenities = {};
    if (req.body.amenities) {
      try {
        amenities = req.body.amenities;
      } catch (error) {
        console.error('Error parsing amenities:', error);
        return res.status(400).json({ error: 'Formato de amenities no válido.' });
      }
    }

    const stops = req.body.stops ? JSON.parse(req.body.stops) : [];
    const stopslon = req.body.stopslon ? JSON.parse(req.body.stopslon) : [];
    const stopslat = req.body.stopslat ? JSON.parse(req.body.stopslat) : [];

    if (!busId) {
      return res.status(400).json({ error: 'Se requiere el ID del autobús.' });
    }

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado.' });
    }

    if (name) bus.name = name;
    if (number) bus.number = number;
    if (type) bus.type = type;
    if (capacity !== undefined) bus.capacity = capacity;
    if (busType) bus.busType = busType;
    bus.amenities = amenities;

    if (estimatedTravelTime !== undefined) {
      const parsedEstimatedTravelTime = parseInt(estimatedTravelTime, 10);
      if (isNaN(parsedEstimatedTravelTime)) {
        return res.status(400).json({ error: 'Valor de estimatedTravelTime no válido.' });
      }
      bus.estimatedTravelTime = parsedEstimatedTravelTime;
    }

    let logoUrl = bus.logoUrl;
    if (req.file) {
      const busLogo = req.file;
      const base64Image = busLogo.buffer.toString('base64');
      const contentType = busLogo.mimetype;
      try {
        logoUrl = await uploadImageToFirebase(base64Image, contentType);
        bus.logoUrl = logoUrl;
      } catch (error) {
        console.error('Error al subir el logo del autobús', error);
        return res.status(500).json({ error: 'Error al subir el logo del autobús.' });
      }
    }

    const ownerBus = await OwnerBus.findOne({ userId: req.user._id });
    if (!ownerBus) {
      return res.status(404).json({ error: 'Propietario no encontrado.' });
    }

    let routeData = null;
    if (stops && Array.isArray(stops) && stops.length > 0) {
      const routeUpdate = {
        origin: { name: origin, longitude: originlon, latitude: originlat },
        destination: { name: destination, longitude: destinationlon, latitude: destinationlat },
        stops: stops.map((stop, index) => ({
          name: stop,
          longitude: stopslon[index],
          latitude: stopslat[index]
        })),
        distance,
        estimatedTravelTime: bus.estimatedTravelTime,
        waypoints,
        ownerId: ownerBus._id,
      };

      if (bus.routeId) {
        routeData = await Route.findByIdAndUpdate(bus.routeId, routeUpdate, { new: true });
      } else {
        const newRoute = new Route(routeUpdate);
        routeData = await newRoute.save();
        bus.routeId = routeData._id;
      }
    }

    const updatedBus = await bus.save();

    if (latitude !== undefined && longitude !== undefined) {
      await Location.findOneAndUpdate(
        { busId: bus._id },
        { latitude, longitude },
        { upsert: true, new: true }
      );
    }

    res.status(200).json(updatedBus);
  } catch (error) {
    console.error('Error al actualizar el autobús', error);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
};

module.exports = { updateBus };
