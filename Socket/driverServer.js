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

    socket.on('locationUpdate', async ({ latitude, longitude, deviceToken }) => {
      try {
        if (!latitude || !longitude || !deviceToken) {
          throw new Error('deviceToken,Latitude and longitude are required');
        }

        const bus = await Bus.findOne({ driverId: deviceToken });
        console.log(bus)
        if (!bus) {
          throw new Error('Autobús no encontrado.');
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
    // socket.on('disconnect', async ({ deviceToken }) => {
    //   console.log('A driver disconnected');
    //   try {
    //     const bus = await Bus.findOne({ driverId: deviceToken });
    //     console.log('bus before:', bus);
    //     if (!bus) {
    //       throw new Error('Autobús no encontrado.');
    //     }

    //     if (bus) {
    //       bus.driverId = null;
    //       bus.avilable = false;
    //       await bus.save();
    //     }
    //     console.log('bus after:', bus);
    //   } catch (error) {
    //     console.error('Error handling disconnection:', error);
    //   }
    // });

    socket.on('driverDisconnect', async ({ deviceToken }) => {
      console.log('A driver is disconnecting');
      try {
        const bus = await Bus.findOne({ driverId: deviceToken });
        console.log('bus before:', bus);
        if (!bus) {
          throw new Error('Autobús no encontrado.');
        }

        if (bus) {
          bus.driverId = null;
          bus.avilable = false;
          await bus.save();
        }
        console.log('bus after:', bus);
      } catch (error) {
        console.error('Error handling disconnection:', error);
      }
    });

    socket.on('disconnect', () => {
      console.log('A driver disconnected');
    });
  });
};

module.exports = driverSocketServer;