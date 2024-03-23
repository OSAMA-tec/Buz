const { Bus } = require('../Model/Bus');
const { Location } = require('../Model/location');

const driverSocketServer = (io) => {
  const driverNamespace = io.of('/driver');

  driverNamespace.on('connection', (socket) => {
    console.log('A driver connected');

    socket.on('driverStart', async () => {
      try {
        socket.emit('driverStartSuccess', 'Bus started successfully');
      } catch (error) {
        console.error('Error starting bus:', error);
        socket.emit('error', error.message);
      }
    });

    socket.on('locationUpdate', async ({ latitude, longitude }) => {
      try {
        if (!latitude || !longitude) {
          throw new Error('Latitude and longitude are required');
        }
    
        const bus = await Bus.findOne({ driverId: socket.id });
        if (!bus) {
          throw new Error('Bus not found');
        }
    
        const existingLocation = await Location.findOne({ busId: bus._id });
        if (existingLocation) {
          existingLocation.latitude = latitude;
          existingLocation.longitude = longitude;
          existingLocation.timestamp = Date.now();
          await existingLocation.save();
        }         
        driverNamespace.emit('locationUpdate', { busId: bus._id, latitude, longitude });
      } catch (error) {
        console.error('Error updating location:', error);
        socket.emit('error', error.message);
      }
    });
    socket.on('disconnect', async () => {
      console.log('A driver disconnected');
      try {
        const bus = await Bus.findOne({ driverId: socket.id });
        if (bus) {
          bus.driverId = null;
          bus.available = false;
          await bus.save();
        }
      } catch (error) {
        console.error('Error handling disconnection:', error);
      }
    });
  });
};

module.exports = driverSocketServer;