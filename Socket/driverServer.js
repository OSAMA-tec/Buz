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

    socket.on('updateBusStatus', async ({ delay, delayReason, arrivedLastStop, arrivedNextStop, seatsAvailable }) => {
      try {
        const bus = await Bus.findOne({ driverId: socket.id });
        if (!bus) {
          throw new Error('Bus not found');
        }

        if (delay !== undefined) {
          if (typeof delay !== 'string') {
            throw new Error('Delay must be a string');
          }
          bus.delay = delay;
        }

        if (delayReason !== undefined) {
          if (typeof delayReason !== 'string') {
            throw new Error('Delay reason must be a string');
          }
          bus.delayReason = delayReason;
        }

        if (arrivedLastStop !== undefined) {
          if (typeof arrivedLastStop !== 'string') {
            throw new Error('Arrived last stop must be a string');
          }
          bus.arrivedLastStop = arrivedLastStop;
        }

        if (arrivedNextStop !== undefined) {
          if (typeof arrivedNextStop !== 'string') {
            throw new Error('Arrived next stop must be a string');
          }
          bus.arrivedNextStop = arrivedNextStop;
        }

        if (seatsAvailable !== undefined) {
          if (typeof seatsAvailable !== 'number') {
            throw new Error('Seats available must be a number');
          }
          bus.seatsAvailable = seatsAvailable;
        }

        await bus.save();

        driverNamespace.emit('busStatusUpdate', {
          busId: bus._id,
          delay: bus.delay,
          delayReason: bus.delayReason,
          arrivedLastStop: bus.arrivedLastStop,
          arrivedNextStop: bus.arrivedNextStop,
          seatsAvailable: bus.seatsAvailable,
        });
      } catch (error) {
        console.error('Error updating bus status:', error);
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