const { Bus } = require('../../Model/Bus');
const { Location } = require('../../Model/location');

function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; 
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;
  return distance;
}

const verifyDriver = async (req, res) => {
  try {
    const { busNumber, latitude, longitude } = req.body;

    if (!busNumber || !latitude || !longitude) {
      return res.status(400).json({ error: 'Se requieren el número del autobús, la latitud y la longitud.' });
    }

    const bus = await Bus.findOne({ number: busNumber });
    if (!bus) {
      return res.status(404).json({ error: 'Autobús no encontrado.' });
    }

    const busLocation = await Location.findOne({ busId: bus._id }).sort({ timestamp: -1 });

    if (!busLocation) {
      bus.driverId = req.body.Devicetoken;
      bus.avilable = true;
      await bus.save();
      return res.status(200).json({ message: 'Conductor autenticado con éxito.', bus });
    }

    const distance = calculateDistance(latitude, longitude, busLocation.latitude, busLocation.longitude);
    if (distance > 300) {
      return res.status(403).json({ error: 'No tienes permitido conectarte. Por favor, acércate al autobús.' });
    }

    bus.driverId = req.body.Devicetoken;
    bus.avilable = true;
    await bus.save();

    res.status(200).json({ message: 'Conductor autenticado con éxito.', bus });
  } catch (error) {
    console.error('Error authenticating driver:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { verifyDriver };